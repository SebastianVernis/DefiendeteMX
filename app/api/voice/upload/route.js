import { NextResponse } from 'next/server';
import { connectDB } from '@/app/config/database';
import VoiceRecording from '@/app/models/VoiceRecording';
import { validateAudioFile } from '@/app/issues/services/aiAnalysisService';

/**
 * POST /api/voice/upload
 * Upload and save voice recording
 */
export async function POST(request) {
  try {
    await connectDB();

    // Parse form data
    const formData = await request.formData();
    const audioFile = formData.get('audio');
    const userId = formData.get('userId');
    const issueId = formData.get('issueId');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const accuracy = formData.get('accuracy');
    const notes = formData.get('notes');

    // Validate required fields
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate audio file
    const validation = validateAudioFile(audioFile);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid audio file', details: validation.errors },
        { status: 400 }
      );
    }

    // Convert audio to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // For demo: Store as base64 (in production, use cloud storage)
    const base64Audio = buffer.toString('base64');
    const storageUrl = `data:${audioFile.type};base64,${base64Audio}`;

    // Calculate duration (estimate from file size)
    const estimatedDuration = Math.round(audioFile.size / 16000);

    // Create recording document
    const recordingData = {
      user: userId,
      filename: audioFile.name || `recording_${Date.now()}.webm`,
      duration: estimatedDuration,
      fileSize: audioFile.size,
      mimeType: audioFile.type,
      storageUrl: storageUrl,
      storageProvider: 'LOCAL',
      recordedAt: new Date(),
      analysisStatus: 'PENDING'
    };

    // Add location if provided
    if (latitude && longitude) {
      recordingData.location = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        accuracy: accuracy ? parseFloat(accuracy) : undefined
      };
    }

    // Add issue reference if provided
    if (issueId) {
      recordingData.issue = issueId;
    }

    // Add notes if provided
    if (notes) {
      recordingData.notes = notes;
    }

    // Save to database
    const recording = new VoiceRecording(recordingData);
    await recording.save();

    // Return success response (without the large base64 data)
    const response = {
      id: recording._id,
      filename: recording.filename,
      duration: recording.duration,
      durationFormatted: recording.durationFormatted,
      fileSize: recording.fileSize,
      fileSizeFormatted: recording.fileSizeFormatted,
      recordedAt: recording.recordedAt,
      analysisStatus: recording.analysisStatus,
      location: recording.location,
      message: 'Recording uploaded successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload recording', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/upload
 * Get user's recordings
 */
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const issueId = searchParams.get('issueId');
    const isEmergency = searchParams.get('isEmergency');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId && !issueId) {
      return NextResponse.json(
        { error: 'User ID or Issue ID is required' },
        { status: 400 }
      );
    }

    let query = { isDeleted: false };

    if (userId) {
      query.user = userId;
    }

    if (issueId) {
      query.issue = issueId;
    }

    if (isEmergency !== null && isEmergency !== undefined) {
      query.isEmergency = isEmergency === 'true';
    }

    const recordings = await VoiceRecording.find(query)
      .sort({ recordedAt: -1 })
      .limit(limit)
      .select('-storageUrl') // Exclude large base64 data
      .lean();

    return NextResponse.json({
      recordings,
      count: recordings.length
    });
  } catch (error) {
    console.error('Get recordings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings', details: error.message },
      { status: 500 }
    );
  }
}
