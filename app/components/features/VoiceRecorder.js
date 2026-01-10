'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { 
  getEmotionColor, 
  getEmotionIcon, 
  formatStressLevel 
} from '@/app/issues/services/aiAnalysisService';

/**
 * VoiceRecorder Component
 * Records audio with background capability, real-time visualization,
 * and AI analysis (transcription + emotion detection)
 */
export default function VoiceRecorder({ 
  userId, 
  issueId, 
  onRecordingComplete,
  onAnalysisComplete,
  autoAnalyze = true,
  showVisualization = true 
}) {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [recordingId, setRecordingId] = useState(null);
  
  // UI state
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Request microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      stopRecording();
      cleanup();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  /**
   * Check microphone permission
   */
  async function checkMicrophonePermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Microphone permission error:', err);
      setError('Permiso de micrófono denegado. Por favor, habilita el acceso al micrófono.');
      setPermissionGranted(false);
    }
  }

  /**
   * Start recording
   */
  async function startRecording() {
    try {
      setError(null);
      audioChunksRef.current = [];

      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;

      // Setup audio visualization
      if (showVisualization) {
        setupAudioVisualization(stream);
      }

      // Create MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        
        // Upload and optionally analyze
        if (userId) {
          await uploadRecording(blob);
        }
        
        if (onRecordingComplete) {
          onRecordingComplete(blob);
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
    } catch (err) {
      console.error('Start recording error:', err);
      setError('Error al iniciar la grabación: ' + err.message);
    }
  }

  /**
   * Pause recording
   */
  function pauseRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }

  /**
   * Resume recording
   */
  function resumeRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }

  /**
   * Stop recording
   */
  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      cleanup();
    }
  }

  /**
   * Setup audio visualization
   */
  function setupAudioVisualization(stream) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      visualize();
    } catch (err) {
      console.error('Visualization setup error:', err);
    }
  }

  /**
   * Visualize audio levels
   */
  function visualize() {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (!isRecording) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, (average / 255) * 100));
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }

  /**
   * Cleanup audio resources
   */
  function cleanup() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }

  /**
   * Upload recording to server
   */
  async function uploadRecording(blob) {
    try {
      const formData = new FormData();
      formData.append('audio', blob, `recording_${Date.now()}.webm`);
      formData.append('userId', userId);
      
      if (issueId) {
        formData.append('issueId', issueId);
      }

      // Get location if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          formData.append('latitude', position.coords.latitude);
          formData.append('longitude', position.coords.longitude);
          formData.append('accuracy', position.coords.accuracy);
        } catch (geoError) {
          console.warn('Geolocation error:', geoError);
        }
      }

      const response = await fetch('/api/voice/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setRecordingId(data.id);

      // Auto-analyze if enabled
      if (autoAnalyze) {
        await analyzeRecording(data.id);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Error al subir la grabación: ' + err.message);
    }
  }

  /**
   * Analyze recording
   */
  async function analyzeRecording(recId = recordingId) {
    if (!recId) {
      setError('No hay grabación para analizar');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      const formData = new FormData();
      formData.append('recordingId', recId);

      const response = await fetch('/api/voice/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisResults(data);

      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Error al analizar la grabación: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  /**
   * Format time display
   */
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Reset recorder
   */
  function reset() {
    setAudioBlob(null);
    setRecordingTime(0);
    setAnalysisResults(null);
    setRecordingId(null);
    setError(null);
  }

  return (
    <Card variant="glass" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
            🎙️
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Grabador de Voz</h3>
            <p className="text-sm text-gray-600">Con análisis de IA en tiempo real</p>
          </div>
        </div>
        {isRecording && (
          <Badge variant="danger" className="animate-pulse-glow">
            ● GRABANDO
          </Badge>
        )}
      </div>

      {/* Permission Warning */}
      {!permissionGranted && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-800">
            ⚠️ Se requiere permiso de micrófono para grabar audio
          </p>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={checkMicrophonePermission}
            className="mt-2"
          >
            Solicitar Permiso
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Recording Controls */}
      {!audioBlob && (
        <div className="space-y-4">
          {/* Timer and Visualization */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatTime(recordingTime)}
            </div>
            
            {/* Audio Level Visualization */}
            {showVisualization && isRecording && (
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                  style={{ width: `${audioLevel}%` }}
                />
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 justify-center">
            {!isRecording ? (
              <Button
                variant="sos"
                size="lg"
                onClick={startRecording}
                disabled={!permissionGranted}
                icon="🎙️"
              >
                Iniciar Grabación
              </Button>
            ) : (
              <>
                {!isPaused ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={pauseRecording}
                    icon="⏸️"
                  >
                    Pausar
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={resumeRecording}
                    icon="▶️"
                  >
                    Reanudar
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="lg"
                  onClick={stopRecording}
                  icon="⏹️"
                >
                  Detener
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Recording Complete */}
      {audioBlob && !analysisResults && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Grabación Completada
            </h4>
            <p className="text-gray-600 mb-4">
              Duración: {formatTime(recordingTime)}
            </p>
          </div>

          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
              <p className="text-gray-600">Analizando grabación...</p>
            </div>
          ) : (
            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => analyzeRecording()}
                icon="🤖"
              >
                Analizar con IA
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={reset}
                icon="🔄"
              >
                Nueva Grabación
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <div className="space-y-6">
          {/* Emergency Alert */}
          {analysisResults.isEmergency && (
            <div className="p-4 bg-red-50 border-2 border-red-500 rounded-xl animate-pulse-glow">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <span className="text-2xl">🚨</span>
                <span>SITUACIÓN DE EMERGENCIA DETECTADA</span>
              </div>
              {analysisResults.emergencyKeywords && analysisResults.emergencyKeywords.length > 0 && (
                <p className="text-sm text-red-600">
                  Palabras clave: {analysisResults.emergencyKeywords.map(k => k.keyword).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Emotion Analysis */}
          {analysisResults.emotionAnalysis && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Análisis Emocional</h4>
              
              {/* Primary Emotion */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getEmotionColor(analysisResults.emotionAnalysis.primaryEmotion)} text-white font-bold`}>
                  <span className="text-2xl">{getEmotionIcon(analysisResults.emotionAnalysis.primaryEmotion)}</span>
                  <span>{analysisResults.emotionAnalysis.primaryEmotion}</span>
                </div>
              </div>

              {/* Stress Level */}
              {analysisResults.emotionAnalysis.overallStressLevel !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Nivel de Estrés</span>
                    <Badge 
                      variant={analysisResults.emotionAnalysis.overallStressLevel > 7 ? 'danger' : 'warning'}
                    >
                      {analysisResults.emotionAnalysis.overallStressLevel}/10
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        analysisResults.emotionAnalysis.overallStressLevel > 7 
                          ? 'bg-gradient-to-r from-red-500 to-red-700' 
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      }`}
                      style={{ width: `${analysisResults.emotionAnalysis.overallStressLevel * 10}%` }}
                    />
                  </div>
                </div>
              )}

              {/* All Emotions */}
              {analysisResults.emotionAnalysis.emotions && (
                <div className="flex flex-wrap gap-2">
                  {analysisResults.emotionAnalysis.emotions.slice(0, 3).map((emotion, idx) => (
                    <Badge 
                      key={idx}
                      variant="default"
                      className="text-xs"
                    >
                      {getEmotionIcon(emotion.emotion)} {emotion.emotion} ({Math.round(emotion.confidence * 100)}%)
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transcription */}
          {analysisResults.transcription && analysisResults.transcription.text && (
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Transcripción</h4>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-800 leading-relaxed">
                  {analysisResults.transcription.text}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span>Idioma: {analysisResults.transcription.language}</span>
                  <span>Confianza: {Math.round((analysisResults.transcription.confidence || 0.85) * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center pt-4 border-t">
            <Button
              variant="primary"
              size="md"
              onClick={reset}
              icon="🔄"
            >
              Nueva Grabación
            </Button>
            {issueId && (
              <Button
                variant="success"
                size="md"
                onClick={() => {/* Attach to issue logic */}}
                icon="📎"
              >
                Adjuntar a Caso
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
