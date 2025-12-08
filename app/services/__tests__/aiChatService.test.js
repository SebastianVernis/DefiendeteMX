/**
 * AI Chat Service Tests
 * Comprehensive test suite for the AI chatbot service
 */

import AIChatService, { LEGAL_KNOWLEDGE_BASE, CRISIS_KEYWORDS } from '../aiChatService';

describe('AIChatService', () => {
  describe('validateMessage', () => {
    test('should validate correct message', () => {
      const result = AIChatService.validateMessage('Hola, necesito ayuda');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Hola, necesito ayuda');
    });

    test('should reject empty message', () => {
      const result = AIChatService.validateMessage('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    test('should reject whitespace-only message', () => {
      const result = AIChatService.validateMessage('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    test('should reject non-string message', () => {
      const result = AIChatService.validateMessage(null);
      expect(result.valid).toBe(false);
    });

    test('should reject message exceeding max length', () => {
      const longMessage = 'a'.repeat(5001);
      const result = AIChatService.validateMessage(longMessage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should trim whitespace from message', () => {
      const result = AIChatService.validateMessage('  Hola  ');
      expect(result.valid).toBe(true);
      expect(result.message).toBe('Hola');
    });
  });

  describe('detectSentiment', () => {
    test('should detect CRISIS sentiment', () => {
      const sentiment = AIChatService.detectSentiment('Quiero suicidarme');
      expect(sentiment).toBe('CRISIS');
    });

    test('should detect DISTRESSED sentiment', () => {
      const sentiment = AIChatService.detectSentiment('Estoy desesperado y tengo mucho miedo');
      expect(sentiment).toBe('DISTRESSED');
    });

    test('should detect NEGATIVE sentiment', () => {
      const sentiment = AIChatService.detectSentiment('Me siento muy triste');
      expect(sentiment).toBe('NEGATIVE');
    });

    test('should detect POSITIVE sentiment', () => {
      const sentiment = AIChatService.detectSentiment('Gracias por tu ayuda');
      expect(sentiment).toBe('POSITIVE');
    });

    test('should detect NEUTRAL sentiment', () => {
      const sentiment = AIChatService.detectSentiment('¿Cuáles son mis derechos?');
      expect(sentiment).toBe('NEUTRAL');
    });
  });

  describe('detectCrisis', () => {
    test('should detect crisis with suicide keywords', () => {
      const result = AIChatService.detectCrisis('Quiero matarme, no puedo más');
      expect(result.isCrisis).toBe(true);
      expect(result.keywords).toContain('matarme');
      expect(result.keywords).toContain('no puedo más');
    });

    test('should detect crisis with immediate danger keywords', () => {
      const result = AIChatService.detectCrisis('Me va a matar, ayuda urgente');
      expect(result.isCrisis).toBe(true);
      expect(result.keywords).toContain('me va a matar');
      expect(result.keywords).toContain('ayuda urgente');
    });

    test('should not detect crisis in normal message', () => {
      const result = AIChatService.detectCrisis('Necesito información sobre mis derechos');
      expect(result.isCrisis).toBe(false);
      expect(result.keywords).toHaveLength(0);
    });

    test('should assess severity based on keyword count', () => {
      const result1 = AIChatService.detectCrisis('Quiero suicidarme');
      expect(result1.severity).toBe('MEDIUM');

      const result2 = AIChatService.detectCrisis('Quiero suicidarme, no puedo más, estoy desesperado');
      expect(result2.severity).toBe('HIGH');
    });
  });

  describe('detectIntent', () => {
    test('should detect GREETING intent', () => {
      const result = AIChatService.detectIntent('Hola', {});
      expect(result.type).toBe('GREETING');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('should detect LEGAL_QUESTION intent', () => {
      const result = AIChatService.detectIntent('¿Cuáles son mis derechos legales?', {});
      expect(result.type).toBe('LEGAL_QUESTION');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    test('should detect PROCEDURAL_QUESTION intent', () => {
      const result = AIChatService.detectIntent('¿Cómo presento una denuncia?', {});
      expect(result.type).toBe('PROCEDURAL_QUESTION');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should detect EMOTIONAL_SUPPORT intent', () => {
      const result = AIChatService.detectIntent('Tengo mucho miedo', {});
      expect(result.type).toBe('EMOTIONAL_SUPPORT');
      expect(result.confidence).toBeGreaterThan(0.7);
    });

    test('should detect GENERAL intent for unclear messages', () => {
      const result = AIChatService.detectIntent('xyz', {});
      expect(result.type).toBe('GENERAL');
    });
  });

  describe('generateResponse', () => {
    test('should generate crisis response for crisis message', async () => {
      const response = await AIChatService.generateResponse('Quiero suicidarme');
      
      expect(response.content).toContain('911');
      expect(response.content).toContain('Línea de la Vida');
      expect(response.crisisDetected).toBe(true);
      expect(response.sentiment).toBe('CRISIS');
      expect(response.metadata.suggestedActions).toContain('CALL_911');
    });

    test('should generate legal response for legal question', async () => {
      const response = await AIChatService.generateResponse(
        '¿Cuáles son mis derechos?',
        { legalScenario: 'DETENCION_POLICIAL' }
      );
      
      expect(response.content).toContain('derecho');
      expect(response.crisisDetected).toBe(false);
      expect(response.metadata.detectedIntent).toBe('LEGAL_QUESTION');
    });

    test('should generate greeting response', async () => {
      const response = await AIChatService.generateResponse('Hola');
      
      expect(response.content).toContain('Hola');
      expect(response.content).toContain('ayuda');
      expect(response.metadata.detectedIntent).toBe('GREETING');
    });

    test('should include processing time in metadata', async () => {
      const response = await AIChatService.generateResponse('Test message');
      
      expect(response.metadata.processingTime).toBeGreaterThan(0);
      expect(typeof response.metadata.processingTime).toBe('number');
    });

    test('should include confidence score', async () => {
      const response = await AIChatService.generateResponse('Test message');
      
      expect(response.metadata.confidence).toBeGreaterThanOrEqual(0);
      expect(response.metadata.confidence).toBeLessThanOrEqual(1);
    });

    test('should handle errors gracefully', async () => {
      const response = await AIChatService.generateResponse(null);
      
      expect(response.content).toContain('error');
      expect(response.metadata.detectedIntent).toBe('ERROR');
    });
  });

  describe('generateLegalResponse', () => {
    test('should generate response for DETENCION_POLICIAL', () => {
      const intent = { type: 'LEGAL_QUESTION' };
      const context = { legalScenario: 'DETENCION_POLICIAL' };
      
      const response = AIChatService.generateLegalResponse(intent, context);
      
      expect(response).toContain('Detención Policial');
      expect(response).toContain('derecho');
      expect(response).toContain('abogado');
    });

    test('should generate response for VIOLENCIA_DOMESTICA', () => {
      const intent = { type: 'LEGAL_QUESTION' };
      const context = { legalScenario: 'VIOLENCIA_DOMESTICA' };
      
      const response = AIChatService.generateLegalResponse(intent, context);
      
      expect(response).toContain('Violencia Doméstica');
      expect(response).toContain('911');
      expect(response).toContain('protección');
    });

    test('should include legal basis', () => {
      const intent = { type: 'LEGAL_QUESTION' };
      const context = { legalScenario: 'DETENCION_POLICIAL' };
      
      const response = AIChatService.generateLegalResponse(intent, context);
      
      expect(response).toContain('Base Legal');
      expect(response).toContain('Constitución');
    });

    test('should include resources', () => {
      const intent = { type: 'LEGAL_QUESTION' };
      const context = { legalScenario: 'DETENCION_POLICIAL' };
      
      const response = AIChatService.generateLegalResponse(intent, context);
      
      expect(response).toContain('Recursos');
      expect(response).toContain('CNDH');
    });
  });

  describe('getQuickActions', () => {
    test('should return all quick actions', () => {
      const actions = AIChatService.getQuickActions();
      
      expect(Array.isArray(actions)).toBe(true);
      expect(actions.length).toBeGreaterThan(0);
      expect(actions[0]).toHaveProperty('key');
      expect(actions[0]).toHaveProperty('title');
    });

    test('should include emergency numbers action', () => {
      const actions = AIChatService.getQuickActions();
      const emergencyAction = actions.find(a => a.key === 'EMERGENCY_NUMBERS');
      
      expect(emergencyAction).toBeDefined();
      expect(emergencyAction.title).toContain('Emergencia');
    });
  });

  describe('getQuickAction', () => {
    test('should return specific quick action', () => {
      const action = AIChatService.getQuickAction('EMERGENCY_NUMBERS');
      
      expect(action).toBeDefined();
      expect(action.title).toBeDefined();
      expect(action.content).toBeDefined();
      expect(action.content).toContain('911');
    });

    test('should return null for invalid action key', () => {
      const action = AIChatService.getQuickAction('INVALID_KEY');
      
      expect(action).toBeNull();
    });
  });

  describe('getLegalScenarios', () => {
    test('should return all legal scenarios', () => {
      const scenarios = AIChatService.getLegalScenarios();
      
      expect(Array.isArray(scenarios)).toBe(true);
      expect(scenarios.length).toBeGreaterThan(0);
      expect(scenarios[0]).toHaveProperty('key');
      expect(scenarios[0]).toHaveProperty('title');
    });

    test('should include all major scenarios', () => {
      const scenarios = AIChatService.getLegalScenarios();
      const keys = scenarios.map(s => s.key);
      
      expect(keys).toContain('DETENCION_POLICIAL');
      expect(keys).toContain('VIOLENCIA_DOMESTICA');
      expect(keys).toContain('VIOLENCIA_SEXUAL');
      expect(keys).toContain('ACOSO_LABORAL');
    });
  });

  describe('LEGAL_KNOWLEDGE_BASE', () => {
    test('should have complete structure for each scenario', () => {
      Object.keys(LEGAL_KNOWLEDGE_BASE).forEach(key => {
        const scenario = LEGAL_KNOWLEDGE_BASE[key];
        
        expect(scenario).toHaveProperty('title');
        expect(scenario).toHaveProperty('rights');
        expect(scenario).toHaveProperty('steps');
        expect(scenario).toHaveProperty('legalBasis');
        expect(scenario).toHaveProperty('resources');
        
        expect(Array.isArray(scenario.rights)).toBe(true);
        expect(Array.isArray(scenario.steps)).toBe(true);
        expect(Array.isArray(scenario.resources)).toBe(true);
        
        expect(scenario.rights.length).toBeGreaterThan(0);
        expect(scenario.steps.length).toBeGreaterThan(0);
        expect(scenario.resources.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CRISIS_KEYWORDS', () => {
    test('should contain suicide-related keywords', () => {
      expect(CRISIS_KEYWORDS).toContain('suicidio');
      expect(CRISIS_KEYWORDS).toContain('matarme');
    });

    test('should contain immediate danger keywords', () => {
      expect(CRISIS_KEYWORDS).toContain('me va a matar');
      expect(CRISIS_KEYWORDS).toContain('emergencia');
    });

    test('should be an array', () => {
      expect(Array.isArray(CRISIS_KEYWORDS)).toBe(true);
      expect(CRISIS_KEYWORDS.length).toBeGreaterThan(0);
    });
  });
});
