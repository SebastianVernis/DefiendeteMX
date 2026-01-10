import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import VoiceRecording from '@/app/models/VoiceRecording';
import { transcribeAudio } from '@/app/issues/services/aiAnalysisService';

/**
 * POST /api/voice/transcribe
 * Transcribe a voice recording
 */
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const recordingId = formData.get('recordingId');
    const audioFile = formData.get('audio');
    const language = formData.get('language') || 'es';

    // Validate inputs
    if (!recordingId && !audioFile) {
      return NextResponse.json(
        { error: 'Recording ID or audio file is required' },
        { status: 400 }
      );
    }

    let recording;
    let audioToTranscribe;

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
        audioToTranscribe = Buffer.from(base64Data, 'base64');
      } else {
        return NextResponse.json(
          { error: 'Cannot access audio file from storage' },
          { status: 500 }
        );
      }
    } else {
      // Use provided audio file
      const arrayBuffer = await audioFile.arrayBuffer();
      audioToTranscribe = Buffer.from(arrayBuffer);
    }

    // Perform transcription
    const transcriptionResult = await transcribeAudio(audioToTranscribe, {
      language,
      responseFormat: 'verbose_json'
    });

    // Update recording with transcription if recordingId provided
    if (recording) {
      await recording.updateTranscription(transcriptionResult);
      
      return NextResponse.json({
        recordingId: recording._id,
        transcription: recording.transcription,
        isEmergency: recording.isEmergency,
        emergencyKeywords: recording.emergencyKeywords,
        analysisStatus: recording.analysisStatus,
        message: 'Transcription completed successfully'
      });
    }

    // Return transcription only if no recording
    return NextResponse.json({
      transcription: transcriptionResult,
      message: 'Transcription completed successfully'
    });
  } catch (error) {
    console.error('Transcription error:', error);

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
              code: 'TRANSCRIPTION_ERROR',
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
      { error: 'Failed to transcribe audio', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/transcribe
 * Get transcription for a recording
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
      .select('transcription isEmergency emergencyKeywords analysisStatus');

    if (!recording) {
      return NextResponse.json(
        { error: 'Recording not found' },
        { status: 404 }
      );
    }

    if (!recording.transcription || !recording.transcription.text) {
      return NextResponse.json(
        { error: 'Transcription not available', analysisStatus: recording.analysisStatus },
        { status: 404 }
      );
    }

    return NextResponse.json({
      recordingId: recording._id,
      transcription: recording.transcription,
      isEmergency: recording.isEmergency,
      emergencyKeywords: recording.emergencyKeywords,
      analysisStatus: recording.analysisStatus
    });
  } catch (error) {
    console.error('Get transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcription', details: error.message },
      { status: 500 }
    );
  }
}
