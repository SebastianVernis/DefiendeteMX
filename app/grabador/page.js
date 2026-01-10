'use client';

import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import VoiceRecorder from '../components/features/VoiceRecorder';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/**
 * Voice Recorder Demo Page
 * Showcases the voice recording component with AI analysis
 */
export default function GrabadorPage() {
  const [recordings, setRecordings] = useState([]);
  
  // Mock user ID for demo (in production, get from auth)
  const userId = 'demo-user-123';

  const handleRecordingComplete = (blob) => {
    console.log('Recording completed:', blob);
  };

  const handleAnalysisComplete = (results) => {
    console.log('Analysis completed:', results);
    setRecordings(prev => [results, ...prev]);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-4">
              <span>🎙️</span>
              Nueva Herramienta
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4 font-display">
              Grabador de Voz con
              <span className="gradient-text"> Análisis de IA</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Graba audio en segundo plano y obtén transcripción automática con análisis emocional
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card variant="default" hover={true} className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl">
                🎤
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Grabación en Segundo Plano</h3>
              <p className="text-sm text-gray-600">
                Graba mientras usas otras funciones de la app
              </p>
            </Card>

            <Card variant="default" hover={true} className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-3xl">
                📝
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Transcripción Automática</h3>
              <p className="text-sm text-gray-600">
                Convierte voz a texto con IA de OpenAI Whisper
              </p>
            </Card>

            <Card variant="default" hover={true} className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-3xl">
                😰
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Análisis Emocional</h3>
              <p className="text-sm text-gray-600">
                Detecta emociones y nivel de estrés en tiempo real
              </p>
            </Card>
          </div>

          {/* Voice Recorder Component */}
          <div className="mb-12">
            <VoiceRecorder
              userId={userId}
              onRecordingComplete={handleRecordingComplete}
              onAnalysisComplete={handleAnalysisComplete}
              autoAnalyze={true}
              showVisualization={true}
            />
          </div>

          {/* How It Works */}
          <Card variant="glass" className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ¿Cómo Funciona?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Inicia la Grabación</h3>
                  <p className="text-gray-600 text-sm">
                    Presiona el botón de grabación y permite el acceso al micrófono. La grabación puede continuar en segundo plano.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Visualización en Tiempo Real</h3>
                  <p className="text-gray-600 text-sm">
                    Observa los niveles de audio mientras grabas. Puedes pausar y reanudar cuando lo necesites.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Análisis Automático con IA</h3>
                  <p className="text-gray-600 text-sm">
                    Al detener la grabación, la IA analiza el audio para generar transcripción y detectar emociones.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Resultados y Evidencia</h3>
                  <p className="text-gray-600 text-sm">
                    Revisa la transcripción, emociones detectadas y nivel de estrés. Adjunta la grabación a un caso legal como evidencia.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Recordings */}
          {recordings.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Grabaciones Recientes
              </h2>
              <div className="space-y-4">
                {recordings.map((recording, idx) => (
                  <Card key={idx} variant="default" className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          Grabación #{recordings.length - idx}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(recording.recordedAt || Date.now()).toLocaleString('es-MX')}
                        </p>
                      </div>
                      {recording.isEmergency && (
                        <Badge variant="danger">🚨 Emergencia</Badge>
                      )}
                    </div>

                    {recording.emotionAnalysis && (
                      <div className="mb-3">
                        <Badge variant="primary">
                          {recording.emotionAnalysis.primaryEmotion}
                        </Badge>
                        <Badge variant="warning" className="ml-2">
                          Estrés: {recording.emotionAnalysis.overallStressLevel}/10
                        </Badge>
                      </div>
                    )}

                    {recording.transcription && (
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {recording.transcription.text}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Use Cases */}
          <Card variant="gradient" className="p-8 mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Casos de Uso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🚨</div>
                <h3 className="font-bold text-white mb-2">Situaciones de Emergencia</h3>
                <p className="text-white/90 text-sm">
                  Graba evidencia de amenazas, agresiones o situaciones de peligro con análisis emocional automático.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">⚖️</div>
                <h3 className="font-bold text-white mb-2">Evidencia Legal</h3>
                <p className="text-white/90 text-sm">
                  Documenta conversaciones importantes con transcripción precisa para casos legales.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">👮</div>
                <h3 className="font-bold text-white mb-2">Interacciones Policiales</h3>
                <p className="text-white/90 text-sm">
                  Registra detenciones o interrogatorios con análisis de estrés y emociones.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="font-bold text-white mb-2">Violencia Doméstica</h3>
                <p className="text-white/90 text-sm">
                  Captura evidencia de abuso verbal o amenazas con detección automática de palabras clave.
                </p>
              </div>
            </div>
          </Card>

          {/* Privacy Notice */}
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex gap-3">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Privacidad y Seguridad</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Todas las grabaciones se almacenan de forma segura y encriptada</li>
                  <li>✓ Solo tú tienes acceso a tus grabaciones</li>
                  <li>✓ Las grabaciones se eliminan automáticamente después de 30 días</li>
                  <li>✓ El análisis de IA se realiza de forma confidencial</li>
                  <li>✓ Cumplimos con las regulaciones de protección de datos (GDPR)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
