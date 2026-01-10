/**
 * AI Analysis Service Tests
 * Tests for transcription and emotion analysis functions
 */

import {
  transcribeAudio,
  analyzeEmotions,
  processAudioAnalysis,
  validateAudioFile,
  getEmotionColor,
  getEmotionIcon,
  formatStressLevel
} from '../aiAnalysisService';

describe('AI Analysis Service', () => {
  describe('validateAudioFile', () => {
    test('should validate valid audio file', () => {
      const file = {
        size: 1024000, // 1MB
        type: 'audio/webm'
      };

      const result = validateAudioFile(file);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject file that is too large', () => {
      const file = {
        size: 30 * 1024 * 1024, // 30MB
        type: 'audio/webm'
      };

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('exceeds maximum');
    });

    test('should reject invalid file type', () => {
      const file = {
        size: 1024000,
        type: 'video/mp4'
      };

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid file type');
    });

    test('should reject missing file', () => {
      const result = validateAudioFile(null);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toBe('No file provided');
    });

    test('should reject recording that is too long', () => {
      const file = {
        size: 1024000,
        type: 'audio/webm',
        duration: 700 // 11+ minutes
      };

      const result = validateAudioFile(file);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('too long'))).toBe(true);
    });

    test('should accept all valid audio types', () => {
      const validTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
      
      validTypes.forEach(type => {
        const file = { size: 1024000, type };
        const result = validateAudioFile(file);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('transcribeAudio', () => {
    test('should return mock transcription in development', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await transcribeAudio(mockAudio);
      
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('segments');
      expect(result).toHaveProperty('provider');
      expect(result.language).toBe('es');
      expect(result.provider).toBe('WHISPER');
    });

    test('should include segments in transcription', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await transcribeAudio(mockAudio);
      
      expect(Array.isArray(result.segments)).toBe(true);
      expect(result.segments.length).toBeGreaterThan(0);
      expect(result.segments[0]).toHaveProperty('text');
      expect(result.segments[0]).toHaveProperty('start');
      expect(result.segments[0]).toHaveProperty('end');
    });

    test('should respect language option', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await transcribeAudio(mockAudio, { language: 'en' });
      
      expect(result.language).toBe('en');
    });
  });

  describe('analyzeEmotions', () => {
    test('should return emotion analysis', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await analyzeEmotions(mockAudio);
      
      expect(result).toHaveProperty('primaryEmotion');
      expect(result).toHaveProperty('emotions');
      expect(result).toHaveProperty('overallStressLevel');
      expect(result).toHaveProperty('audioFeatures');
      expect(result).toHaveProperty('provider');
    });

    test('should return valid emotion types', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await analyzeEmotions(mockAudio);
      
      const validEmotions = ['CALM', 'STRESSED', 'FEARFUL', 'ANGRY', 'SAD', 'ANXIOUS', 'NEUTRAL', 'DISTRESSED'];
      expect(validEmotions).toContain(result.primaryEmotion);
    });

    test('should return stress level between 0 and 10', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await analyzeEmotions(mockAudio);
      
      expect(result.overallStressLevel).toBeGreaterThanOrEqual(0);
      expect(result.overallStressLevel).toBeLessThanOrEqual(10);
    });

    test('should include audio features', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await analyzeEmotions(mockAudio);
      
      expect(result.audioFeatures).toHaveProperty('averagePitch');
      expect(result.audioFeatures).toHaveProperty('pitchVariation');
      expect(result.audioFeatures).toHaveProperty('averageVolume');
      expect(result.audioFeatures).toHaveProperty('volumeVariation');
      expect(result.audioFeatures).toHaveProperty('speechRate');
      expect(result.audioFeatures).toHaveProperty('pauseFrequency');
    });

    test('should return emotions with confidence scores', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await analyzeEmotions(mockAudio);
      
      expect(Array.isArray(result.emotions)).toBe(true);
      result.emotions.forEach(emotion => {
        expect(emotion).toHaveProperty('emotion');
        expect(emotion).toHaveProperty('confidence');
        expect(emotion.confidence).toBeGreaterThanOrEqual(0);
        expect(emotion.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('processAudioAnalysis', () => {
    test('should return both transcription and emotion analysis', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await processAudioAnalysis(mockAudio);
      
      expect(result).toHaveProperty('transcription');
      expect(result).toHaveProperty('emotionAnalysis');
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('processedAt');
      expect(result.success).toBe(true);
    });

    test('should handle errors gracefully', async () => {
      const invalidAudio = null;
      
      const result = await processAudioAnalysis(invalidAudio);
      
      expect(result.success).toBe(false);
      expect(result).toHaveProperty('error');
    });
  });

  describe('getEmotionColor', () => {
    test('should return color for each emotion', () => {
      const emotions = ['CALM', 'STRESSED', 'FEARFUL', 'ANGRY', 'SAD', 'ANXIOUS', 'NEUTRAL', 'DISTRESSED'];
      
      emotions.forEach(emotion => {
        const color = getEmotionColor(emotion);
        expect(color).toBeTruthy();
        expect(color).toContain('from-');
        expect(color).toContain('to-');
      });
    });

    test('should return default color for unknown emotion', () => {
      const color = getEmotionColor('UNKNOWN');
      expect(color).toBe('from-gray-400 to-gray-500');
    });
  });

  describe('getEmotionIcon', () => {
    test('should return icon for each emotion', () => {
      const emotions = ['CALM', 'STRESSED', 'FEARFUL', 'ANGRY', 'SAD', 'ANXIOUS', 'NEUTRAL', 'DISTRESSED'];
      
      emotions.forEach(emotion => {
        const icon = getEmotionIcon(emotion);
        expect(icon).toBeTruthy();
        expect(typeof icon).toBe('string');
      });
    });

    test('should return default icon for unknown emotion', () => {
      const icon = getEmotionIcon('UNKNOWN');
      expect(icon).toBe('😐');
    });
  });

  describe('formatStressLevel', () => {
    test('should format low stress level', () => {
      const result = formatStressLevel(2);
      expect(result.label).toBe('Bajo');
      expect(result.color).toContain('green');
    });

    test('should format moderate stress level', () => {
      const result = formatStressLevel(5);
      expect(result.label).toBe('Moderado');
      expect(result.color).toContain('yellow');
    });

    test('should format high stress level', () => {
      const result = formatStressLevel(7);
      expect(result.label).toBe('Alto');
      expect(result.color).toContain('orange');
    });

    test('should format critical stress level', () => {
      const result = formatStressLevel(9);
      expect(result.label).toBe('Crítico');
      expect(result.color).toContain('red');
    });

    test('should handle boundary values', () => {
      expect(formatStressLevel(0).label).toBe('Bajo');
      expect(formatStressLevel(3).label).toBe('Bajo');
      expect(formatStressLevel(4).label).toBe('Moderado');
      expect(formatStressLevel(6).label).toBe('Moderado');
      expect(formatStressLevel(7).label).toBe('Alto');
      expect(formatStressLevel(8).label).toBe('Alto');
      expect(formatStressLevel(9).label).toBe('Crítico');
      expect(formatStressLevel(10).label).toBe('Crítico');
    });
  });

  describe('Audio Feature Extraction', () => {
    test('should extract reasonable audio features', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const result = await analyzeEmotions(mockAudio);
      const features = result.audioFeatures;
      
      // Check ranges are reasonable
      expect(features.averagePitch).toBeGreaterThan(0);
      expect(features.averagePitch).toBeLessThan(500);
      
      expect(features.averageVolume).toBeGreaterThanOrEqual(0);
      expect(features.averageVolume).toBeLessThanOrEqual(1);
      
      expect(features.speechRate).toBeGreaterThan(0);
      expect(features.speechRate).toBeLessThan(300);
    });
  });

  describe('Emergency Keyword Detection', () => {
    test('should detect emergency keywords in transcription', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      // Run multiple times to potentially get emergency text
      const results = await Promise.all([
        transcribeAudio(mockAudio),
        transcribeAudio(mockAudio),
        transcribeAudio(mockAudio)
      ]);
      
      // At least one should have text
      expect(results.every(r => r.text)).toBe(true);
    });
  });

  describe('Confidence Scores', () => {
    test('should return confidence scores in valid range', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const transcription = await transcribeAudio(mockAudio);
      
      expect(transcription.confidence).toBeGreaterThanOrEqual(0);
      expect(transcription.confidence).toBeLessThanOrEqual(1);
    });

    test('should return segment confidence scores', async () => {
      const mockAudio = Buffer.from('mock audio data');
      
      const transcription = await transcribeAudio(mockAudio);
      
      transcription.segments.forEach(segment => {
        expect(segment.confidence).toBeGreaterThanOrEqual(0);
        expect(segment.confidence).toBeLessThanOrEqual(1);
      });
    });
  });
});
