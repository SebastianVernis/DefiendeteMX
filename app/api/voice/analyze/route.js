import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import VoiceRecording from '@/app/models/VoiceRecording';
import { processAudioAnalysis } from '@/app/issues/services/aiAnalysisService';

/**
 * POST /api/voice/analyze
 * Complete analysis (transcription + emotion) for a voice recording
 */
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const recordingId = formData.get('recordingId');

    if (!recordingId) {
      return NextResponse.json(
        { error: 'Recording ID is required' },
        { status: 400 }
      );
    }

    // Fetch recording
    const recording = await VoiceRecording.findById(recordingId);
    
    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    if (recording.isDeleted) {
      return NextResponse.json(
        { error: 'Recording has been deleted' },
        { status: 410 }
      );
    }

    // Check if already analyzed
    if (recording.analysisStatus === 'COMPLETED') {
      return NextResponse.json({
        recordingId: recording._id,
        transcription: recording.transcription,
        emotionAnalysis: recording.emotionAnalysis,
        isEmergency: recording.isEmergency,
        emergencyKeywords: recording.emergencyKeywords,
        analysisStatus: recording.analysisStatus,
        message: 'Recording already analyzed'
      });
    }

    // Update status to processing
    recording.analysisStatus = 'PROCESSING';
    await recording.save();

    // Convert base64 to buffer
    let audioBuffer;
    if (recording.storageUrl.startsWith('data:')) {
      const base64Data = recording.storageUrl.split(',')[1];
      audioBuffer = Buffer.from(base64Data, 'base64');
    } else {
      recording.analysisStatus = 'FAILED';
      recording.analysisError = {
        message: 'Cannot access audio file from storage',
        code: 'STORAGE_ERROR',
        timestamp: new Date()
      };
      await recording.save();
      
      return NextResponse.json(
        { error: 'Cannot access audio file from storage' },
        { status: 500 }
      );
    }

    // Perform complete analysis
    const analysisResult = await processAudioAnalysis(audioBuffer, {
      transcription: { language: 'es' },
      emotion: {}
    });

    if (!analysisResult.success) {
      recording.analysisStatus = 'FAILED';
      recording.analysisError = {
        message: analysisResult.error,
        code: 'ANALYSIS_ERROR',
        timestamp: new Date()
      };
      await recording.save();
      
      return NextResponse.json(
        { error: 'Analysis failed', details: analysisResult.error },
        { status: 500 }
      );
    }

    // Update recording with both results
    await recording.updateTranscription(analysisResult.transcription);
    await recording.updateEmotionAnalysis(analysisResult.emotionAnalysis);

    // Reload to get updated data
    await recording.reload();

    return NextResponse.json({
      recordingId: recording._id,
      transcription: recording.transcription,
      emotionAnalysis: recording.emotionAnalysis,
      isEmergency: recording.isEmergency,
      emergencyKeywords: recording.emergencyKeywords,
      analysisStatus: recording.analysisStatus,
      message: 'Complete analysis finished successfully'
    });
  } catch (error) {
    console.error('Complete analysis error:', error);

    // Update recording status to failed
    try {
      const formData = await request.formData();
      const recordingId = formData.get('recordingId');
      
      if (recordingId) {
        const recording = await VoiceRecording.findById(recordingId);
        if (recording) {
          recording.analysisStatus = 'FAILED';
          recording.analysisError = {
            message: error.message,
            code: 'COMPLETE_ANALYSIS_ERROR',
            timestamp: new Date()
          };
          await recording.save();
        }
      }
    } catch (updateError) {
      console.error('Failed to update recording status:', updateError);
    }

    return NextResponse.json(
      { error: 'Failed to analyze recording', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/analyze
 * Get complete analysis results for a recording
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const recordingId = searchParams.get('recordingId');

    if (!recordingId) {
      return NextResponse.json(
        { error: 'Recording ID is required' },
        { status: 400 }
      );
    }

    const recording = await VoiceRecording.findById(recordingId)
      .select('-storageUrl'); // Exclude large base64 data

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      recordingId: recording._id,
      filename: recording.filename,
      duration: recording.duration,
      durationFormatted: recording.durationFormatted,
      recordedAt: recording.recordedAt,
      transcription: recording.transcription,
      emotionAnalysis: recording.emotionAnalysis,
      isEmergency: recording.isEmergency,
      emergencyKeywords: recording.emergencyKeywords,
      analysisStatus: recording.analysisStatus,
      analysisError: recording.analysisError,
      location: recording.location,
      notes: recording.notes,
      tags: recording.tags
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: error.message },
      { status: 500 }
    );
  }
}
