export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { VoiceRecordingDB, getDB } from '@/app/lib/db';
import { validateAudioFile } from '@/app/issues/services/aiAnalysisService';

/**
 * POST /api/voice/upload
 * Upload and save voice recording
 */
export async function POST(request) {
  try {
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
      userId,
      filename: audioFile.name || `recording_${Date.now()}.webm`,
      duration: estimatedDuration,
      fileSize: audioFile.size,
      mimeType: audioFile.type,
      storageUrl: storageUrl,
      storageProvider: 'LOCAL',
      recordedAt: new Date().toISOString(),
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
      recordingData.issueId = issueId;
    }

    // Add notes if provided
    if (notes) {
      recordingData.notes = notes;
    }

    // Save to database
    const recording = await VoiceRecordingDB.create(recordingData);

    // Format duration and file size
    const formatDuration = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    const formatFileSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
      return `${(bytes / 1048576).toFixed(2)} MB`;
    };

    // Return success response (without the large base64 data)
    const response = {
      id: recording.id,
      filename: recording.filename,
      duration: recording.duration,
      durationFormatted: formatDuration(recording.duration),
      fileSize: recording.fileSize,
      fileSizeFormatted: formatFileSize(recording.fileSize),
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

    let recordings = [];

    if (userId) {
      const options = {
        limit,
        isEmergency: isEmergency !== null && isEmergency !== undefined ? isEmergency === 'true' : undefined
      };
      recordings = await VoiceRecordingDB.findByUser(userId, options);
    } else if (issueId) {
      // Get recordings by issue - would need to add this method to VoiceRecordingDB
      const db = getDB();
      const { results } = await db.prepare(`
        SELECT * FROM voice_recordings 
        WHERE issue_id = ? AND is_deleted = 0
        ORDER BY recorded_at DESC
        LIMIT ?
      `).bind(issueId, limit).all();
      
      recordings = results.map(row => ({
        ...transformVoiceRecording(row),
        storageUrl: undefined // Exclude large data
      }));
    }

    // Remove storageUrl from recordings to avoid sending large data
    const sanitizedRecordings = recordings.map(rec => {
      const { storageUrl, ...recordingWithoutUrl } = rec;
      return recordingWithoutUrl;
    });

    return NextResponse.json({
      recordings: sanitizedRecordings,
      count: sanitizedRecordings.length
    });
  } catch (error) {
    console.error('Get recordings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to transform voice recording from D1
function transformVoiceRecording(row) {
  if (!row) return null;
  return {
    id: row.id,
    _id: row.id,
    user: row.user_id,
    userId: row.user_id,
    issue: row.issue_id,
    issueId: row.issue_id,
    filename: row.filename,
    duration: row.duration,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    storageUrl: row.storage_url,
    storageProvider: row.storage_provider,
    recordedAt: row.recorded_at,
    location: JSON.parse(row.location || '{}'),
    transcription: JSON.parse(row.transcription || '{}'),
    emotionAnalysis: JSON.parse(row.emotion_analysis || '{}'),
    analysisStatus: row.analysis_status,
    analysisError: row.analysis_error,
    isEmergency: !!row.is_emergency,
    emergencyKeywords: JSON.parse(row.emergency_keywords || '[]'),
    isEncrypted: !!row.is_encrypted,
    expiresAt: row.expires_at,
    autoDeleteAfterDays: row.auto_delete_after_days,
    tags: JSON.parse(row.tags || '[]'),
    notes: row.notes,
    isDeleted: !!row.is_deleted,
    deletedAt: row.deleted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
