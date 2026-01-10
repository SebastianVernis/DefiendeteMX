import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import VoiceRecording from '@/app/models/VoiceRecording';
import { analyzeEmotions } from '@/app/issues/services/aiAnalysisService';

/**
 * POST /api/voice/analyze-emotion
 * Analyze emotions in a voice recording
 */
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const recordingId = formData.get('recordingId');
    const audioFile = formData.get('audio');

    // Validate inputs
    if (!recordingId && !audioFile) {
      return NextResponse.json(
        { error: 'Recording ID or audio file is required' },
        { status: 400 }
      );
    }

    let recording;
    let audioToAnalyze;

    // If recordingId provided, fetch from database
    if (recordingId) {
      recording = await VoiceRecording.findById(recordingId);
      
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

      // Update status
      recording.analysisStatus = 'PROCESSING';
      await recording.save();

      // Convert base64 back to buffer for processing
      if (recording.storageUrl.startsWith('data:')) {
        const base64Data = recording.storageUrl.split(',')[1];
        audioToAnalyze = Buffer.from(base64Data, 'base64');
      } else {
        return NextResponse.json(
          { error: 'Cannot access audio file from storage' },
          { status: 500 }
        );
      }
    } else {
      // Use provided audio file
      const arrayBuffer = await audioFile.arrayBuffer();
      audioToAnalyze = Buffer.from(arrayBuffer);
    }

    // Perform emotion analysis
    const emotionResult = await analyzeEmotions(audioToAnalyze);

    // Update recording with emotion analysis if recordingId provided
    if (recording) {
      await recording.updateEmotionAnalysis(emotionResult);
      
      return NextResponse.json({
        recordingId: recording._id,
        emotionAnalysis: recording.emotionAnalysis,
        isEmergency: recording.isEmergency,
        analysisStatus: recording.analysisStatus,
        message: 'Emotion analysis completed successfully'
      });
    }

    // Return emotion analysis only if no recording
    return NextResponse.json({
      emotionAnalysis: emotionResult,
      message: 'Emotion analysis completed successfully'
    });
  } catch (error) {
    console.error('Emotion analysis error:', error);

    // Update recording status to failed if applicable
    if (request.formData) {
      const formData = await request.formData();
      const recordingId = formData.get('recordingId');
      
      if (recordingId) {
        try {
          const recording = await VoiceRecording.findById(recordingId);
          if (recording) {
            recording.analysisStatus = 'FAILED';
            recording.analysisError = {
              message: error.message,
              code: 'EMOTION_ANALYSIS_ERROR',
              timestamp: new Date()
            };
            await recording.save();
          }
        } catch (updateError) {
          console.error('Failed to update recording status:', updateError);
        }
      }
    }

    return NextResponse.json(
      { error: 'Failed to analyze emotions', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/analyze-emotion
 * Get emotion analysis for a recording
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
      .select('emotionAnalysis isEmergency analysisStatus');

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    if (!recording.emotionAnalysis || !recording.emotionAnalysis.primaryEmotion) {
      return NextResponse.json(
        { error: 'Emotion analysis not available', analysisStatus: recording.analysisStatus },
        { status: 404 }
      );
    }

    return NextResponse.json({
      recordingId: recording._id,
      emotionAnalysis: recording.emotionAnalysis,
      isEmergency: recording.isEmergency,
      analysisStatus: recording.analysisStatus
    });
  } catch (error) {
    console.error('Get emotion analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emotion analysis', details: error.message },
      { status: 500 }
    );
  }
}
