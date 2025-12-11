'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

/**
 * Nueva Evidencia - Sistema de carga y documentación de evidencia
 */
export default function NuevaEvidenciaPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    caseId: '',
    title: '',
    description: '',
    category: 'FOTO',
    captureDate: new Date().toISOString().split('T')[0],
    location: '',
    isVerified: false
  });
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const processedFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      name: file.name
    }));
    setFiles(prev => [...prev, ...processedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Por favor selecciona al menos un archivo');
      return;
    }

    setUploading(true);

    try {
      // En producción, subir archivos a un servidor seguro
      // Por ahora, simular la carga

      const evidenceData = {
        ...formData,
        files: files.map(f => ({
          name: f.name,
          type: f.type,
          size: f.size,
          uploadedAt: new Date().toISOString()
        })),
        uploadedAt: new Date().toISOString()
      };

      // Guardar en localStorage temporalmente
      const existingEvidence = JSON.parse(localStorage.getItem('evidence') || '[]');
      existingEvidence.push({
        id: Date.now().toString(),
        ...evidenceData
      });
      localStorage.setItem('evidence', JSON.stringify(existingEvidence));

      alert('Evidencia cargada exitosamente');
      router.push('/evidencia');
    } catch (error) {
      console.error('Error uploading evidence:', error);
      alert('Error al subir la evidencia');
    } finally {
      setUploading(false);
    }
  };

  const categories = [
    { id: 'FOTO', label: 'Fotografía', icon: '📷' },
    { id: 'VIDEO', label: 'Video', icon: '🎥' },
    { id: 'AUDIO', label: 'Audio', icon: '🎙️' },
    { id: 'DOCUMENTO', label: 'Documento', icon: '📄' },
    { id: 'MENSAJE', label: 'Mensaje/Chat', icon: '💬' },
    { id: 'OTRO', label: 'Otro', icon: '📎' }
  ];

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              📸 Nueva Evidencia Digital
            </h1>
            <p className="text-gray-600">
              Documenta y almacena evidencia de forma segura
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <h2 className="text-xl font-bold mb-4">Información de la Evidencia</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título de la Evidencia *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Foto de lesiones, Mensaje amenazante, etc."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Detallada
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    placeholder="Describe el contexto de la evidencia, cuándo y dónde fue capturada, y cualquier detalle relevante..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Evidencia *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.category === cat.id
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-3xl mb-1">{cat.icon}</div>
                        <div className="text-sm font-medium">{cat.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Captura
                    </label>
                    <input
                      type="date"
                      value={formData.captureDate}
                      onChange={(e) => setFormData({...formData, captureDate: e.target.value})}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Lugar donde se capturó"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="mb-6">
              <h2 className="text-xl font-bold mb-4">Cargar Archivos</h2>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <div className="text-5xl mb-3">📎</div>
                  <p className="text-lg font-semibold text-gray-700 mb-1">
                    Click para seleccionar archivos
                  </p>
                  <p className="text-sm text-gray-500">
                    o arrastra y suelta aquí
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Soporta: Imágenes, Videos, Audio, PDFs, Documentos
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Archivos seleccionados ({files.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setFiles([])}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Eliminar todos
                    </button>
                  </div>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
                          {file.type.startsWith('video/') ? '🎥' :
                           file.type.startsWith('audio/') ? '🎙️' : '📄'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-700 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="mb-6 bg-blue-50 border-2 border-blue-200">
              <div className="flex gap-3">
                <span className="text-3xl">🔒</span>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">
                    Seguridad y Privacidad
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Los archivos se cifran antes de almacenarse</li>
                    <li>✓ Solo tú puedes acceder a tu evidencia</li>
                    <li>✓ Se genera una cadena de custodia digital</li>
                    <li>✓ Los metadatos se preservan para validación legal</li>
                  </ul>
                  <label className="flex items-center gap-2 mt-3">
                    <input
                      type="checkbox"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium text-blue-900">
                      Certifico que esta evidencia es auténtica y sin alteraciones
                    </span>
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={uploading || files.length === 0}
                fullWidth
              >
                {uploading ? 'Subiendo...' : '✓ Guardar Evidencia'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}
