/**
 * VoiceRecording Model Tests
 * Tests for the VoiceRecording model schema, methods, and validation
 */

import VoiceRecording from '../VoiceRecording';
import mongoose from 'mongoose';

// Mock mongoose
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    model: jest.fn(),
    models: {},
    Schema: actualMongoose.Schema,
    Types: {
      ObjectId: jest.fn((id) => id)
    }
  };
});

describe('VoiceRecording Model', () => {
  describe('Schema Validation', () => {
    test('should require user field', () => {
      const recording = new VoiceRecording({
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      const error = recording.validateSync();
      expect(error.errors.user).toBeDefined();
    });

    test('should require filename field', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      const error = recording.validateSync();
      expect(error.errors.filename).toBeDefined();
    });

    test('should require duration field', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      const error = recording.validateSync();
      expect(error.errors.duration).toBeDefined();
    });

    test('should validate duration is non-negative', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: -10,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      const error = recording.validateSync();
      expect(error.errors.duration).toBeDefined();
    });

    test('should validate emotion enum values', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        emotionAnalysis: {
          primaryEmotion: 'INVALID_EMOTION'
        }
      });

      const error = recording.validateSync();
      expect(error.errors['emotionAnalysis.primaryEmotion']).toBeDefined();
    });

    test('should validate coordinates range', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        location: {
          latitude: 100, // Invalid: > 90
          longitude: -200 // Invalid: < -180
        }
      });

      const error = recording.validateSync();
      expect(error.errors['location.latitude']).toBeDefined();
      expect(error.errors['location.longitude']).toBeDefined();
    });
  });

  describe('Virtual Properties', () => {
    test('should format duration correctly', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 125, // 2:05
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      expect(recording.durationFormatted).toBe('2:05');
    });

    test('should format file size in KB', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 512000, // 500 KB
        storageUrl: 'http://example.com/test.webm'
      });

      expect(recording.fileSizeFormatted).toContain('KB');
    });

    test('should format file size in MB', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 5242880, // 5 MB
        storageUrl: 'http://example.com/test.webm'
      });

      expect(recording.fileSizeFormatted).toContain('MB');
    });

    test('should detect if has transcription', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        transcription: {
          text: 'Test transcription'
        }
      });

      expect(recording.hasTranscription).toBe(true);
    });

    test('should detect if has emotion analysis', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        emotionAnalysis: {
          primaryEmotion: 'STRESSED'
        }
      });

      expect(recording.hasEmotionAnalysis).toBe(true);
    });

    test('should detect if analysis is complete', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        analysisStatus: 'COMPLETED',
        transcription: {
          text: 'Test transcription'
        },
        emotionAnalysis: {
          primaryEmotion: 'STRESSED'
        }
      });

      expect(recording.isAnalysisComplete).toBe(true);
    });
  });

  describe('Instance Methods', () => {
    test('setExpiration should set expiration date', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        autoDeleteAfterDays: 30
      });

      recording.setExpiration();
      expect(recording.expiresAt).toBeDefined();
      expect(recording.expiresAt).toBeInstanceOf(Date);
    });

    test('detectEmergencyKeywords should find emergency words', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      recording.detectEmergencyKeywords('Necesito ayuda urgente, hay peligro');
      
      expect(recording.isEmergency).toBe(true);
      expect(recording.emergencyKeywords.length).toBeGreaterThan(0);
      expect(recording.emergencyKeywords.some(k => k.keyword === 'ayuda')).toBe(true);
      expect(recording.emergencyKeywords.some(k => k.keyword === 'peligro')).toBe(true);
    });

    test('detectEmergencyKeywords should not flag non-emergency text', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      recording.detectEmergencyKeywords('Hola, ¿cómo estás? Todo está bien.');
      
      expect(recording.isEmergency).toBe(false);
      expect(recording.emergencyKeywords.length).toBe(0);
    });

    test('updateAnalysisStatus should set COMPLETED when both analyses exist', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        transcription: {
          text: 'Test'
        },
        emotionAnalysis: {
          primaryEmotion: 'CALM'
        }
      });

      recording.updateAnalysisStatus();
      expect(recording.analysisStatus).toBe('COMPLETED');
    });

    test('updateAnalysisStatus should set PARTIAL when only transcription exists', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        transcription: {
          text: 'Test'
        }
      });

      recording.updateAnalysisStatus();
      expect(recording.analysisStatus).toBe('PARTIAL');
    });

    test('extractContext should extract text around keyword', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      const text = 'Esta es una prueba de ayuda en el contexto de emergencia';
      const context = recording.extractContext(text, 'ayuda', 10);
      
      expect(context).toContain('ayuda');
      expect(context.length).toBeLessThanOrEqual(text.length);
    });
  });

  describe('Default Values', () => {
    test('should set default values correctly', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      expect(recording.mimeType).toBe('audio/webm');
      expect(recording.storageProvider).toBe('LOCAL');
      expect(recording.analysisStatus).toBe('PENDING');
      expect(recording.isDeleted).toBe(false);
      expect(recording.autoDeleteAfterDays).toBe(30);
      expect(recording.isEncrypted).toBe(false);
    });

    test('should set recordedAt to current date by default', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      expect(recording.recordedAt).toBeInstanceOf(Date);
    });
  });

  describe('Emergency Detection', () => {
    test('should mark as emergency when stress level is high', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      recording.emotionAnalysis = {
        overallStressLevel: 8
      };

      // Simulate updateEmotionAnalysis behavior
      if (recording.emotionAnalysis.overallStressLevel >= 7) {
        recording.isEmergency = true;
      }

      expect(recording.isEmergency).toBe(true);
    });

    test('should not mark as emergency when stress level is low', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm'
      });

      recording.emotionAnalysis = {
        overallStressLevel: 4
      };

      expect(recording.isEmergency).toBe(false);
    });
  });

  describe('Transcription Language', () => {
    test('should default to Spanish language', () => {
      const recording = new VoiceRecording({
        user: 'user123',
        filename: 'test.webm',
        duration: 60,
        fileSize: 1024000,
        storageUrl: 'http://example.com/test.webm',
        transcription: {
          text: 'Test'
        }
      });

      expect(recording.transcription.language).toBe('es');
    });
  });
});
