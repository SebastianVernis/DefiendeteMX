'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

/**
 * Nuevo Caso - Formulario para crear casos de emergencia legal
 */
function NuevoCasoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEmergency = searchParams.get('type') === 'emergency';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Información básica
    title: '',
    description: '',
    category: '',
    priority: isEmergency ? 'EMERGENCIA' : 'MEDIO',

    // Detalles del incidente
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '',
    location: {
      address: '',
      city: '',
      state: '',
      coordinates: { lat: null, lng: null }
    },

    // Información del perpetrador
    perpetrator: {
      known: false,
      name: '',
      relationship: '',
      description: '',
      hasWeapons: false,
      substanceAbuse: false
    },

    // Información de la víctima
    victim: {
      hasInjuries: false,
      injuryDescription: '',
      needsMedicalAttention: false,
      psychologicalImpact: '',
      hasDependents: false
    },

    // Evaluación de seguridad
    safetyAssessment: {
      immediateDanger: false,
      riskLevel: 'BAJO',
      hasEscapePlan: false,
      needsShelter: false
    },

    // Testigos
    witnesses: [],

    // Evidencia
    evidenceFiles: []
  });

  const categories = [
    { id: 'VIOLENCIA_DOMESTICA', label: 'Violencia Doméstica', icon: '🏠', description: 'Abuso físico, emocional o económico en el hogar' },
    { id: 'VIOLENCIA_SEXUAL', label: 'Violencia Sexual', icon: '⚠️', description: 'Agresión, acoso o abuso sexual' },
    { id: 'ACOSO_LABORAL', label: 'Acoso Laboral', icon: '💼', description: 'Hostigamiento en el lugar de trabajo' },
    { id: 'ACOSO_ESCOLAR', label: 'Acoso Escolar', icon: '🎓', description: 'Bullying o violencia en instituciones educativas' },
    { id: 'DISCRIMINACION', label: 'Discriminación', icon: '⚖️', description: 'Trato desigual por origen, género, orientación, etc.' },
    { id: 'ABUSO_AUTORIDAD', label: 'Abuso de Autoridad', icon: '👮', description: 'Uso excesivo de poder por funcionarios' },
    { id: 'DETENCION_ARBITRARIA', label: 'Detención Arbitraria', icon: '🔒', description: 'Privación ilegal de libertad' },
    { id: 'VIOLACION_DERECHOS', label: 'Violación de Derechos', icon: '📜', description: 'Transgresión de derechos fundamentales' },
    { id: 'AMENAZAS', label: 'Amenazas', icon: '⚡', description: 'Intimidación o coerción' },
    { id: 'EXTORSION', label: 'Extorsión', icon: '💰', description: 'Obtención ilícita mediante intimidación' },
    { id: 'OTRO', label: 'Otro', icon: '📋', description: 'Otro tipo de caso legal' }
  ];

  const priorities = [
    { id: 'EMERGENCIA', label: 'Emergencia', color: 'red', description: 'Peligro inminente, requiere atención inmediata' },
    { id: 'CRITICO', label: 'Crítico', color: 'red', description: 'Situación grave que requiere acción urgente' },
    { id: 'ALTO', label: 'Alto', color: 'orange', description: 'Requiere atención prioritaria' },
    { id: 'MEDIO', label: 'Medio', color: 'yellow', description: 'Importancia moderada' },
    { id: 'BAJO', label: 'Bajo', color: 'green', description: 'No urgente, puede esperar' }
  ];

  useEffect(() => {
    // Obtener ubicación del usuario si está disponible
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            }
          }));
        },
        (error) => console.log('Geolocation error:', error)
      );
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [
        ...prev.witnesses,
        {
          name: '',
          phone: '',
          relationship: '',
          statement: ''
        }
      ]
    }));
  };

  const updateWitness = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.map((w, i) =>
        i === index ? { ...w, [field]: value } : w
      )
    }));
  };

  const removeWitness = (index) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/casos/${data.issue._id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'No se pudo crear el caso'}`);
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Error al crear el caso. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.category && formData.priority;
      case 2:
        return formData.incidentDate && formData.location.address;
      case 3:
        return true; // Información del perpetrador es opcional
      case 4:
        return true; // Información de la víctima es opcional
      case 5:
        return true; // Siempre se puede enviar
      default:
        return true;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {isEmergency ? '🚨 Reportar Emergencia' : '📋 Nuevo Caso Legal'}
            </h1>
            <p className="text-gray-600">
              {isEmergency
                ? 'Documenta tu situación de emergencia para obtener ayuda inmediata'
                : 'Completa la información para crear un nuevo caso'
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    s === step
                      ? 'bg-purple-600 text-white scale-110'
                      : s < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s < step ? '✓' : s}
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Información Básica</span>
              <span>Incidente</span>
              <span>Perpetrador</span>
              <span>Víctima</span>
              <span>Revisión</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Información Básica */}
            {step === 1 && (
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Información Básica</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Caso *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ej: Acoso laboral por supervisor"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción Detallada *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      placeholder="Describe lo que sucedió con el mayor detalle posible..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Categoría del Caso *
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleInputChange('category', cat.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.category === cat.id
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{cat.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-800">{cat.label}</div>
                              <div className="text-xs text-gray-600">{cat.description}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Prioridad *
                    </label>
                    <div className="space-y-2">
                      {priorities.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleInputChange('priority', p.id)}
                          className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                            formData.priority === p.id
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-gray-800">{p.label}</span>
                              <span className="text-xs text-gray-600 ml-2">{p.description}</span>
                            </div>
                            <div className={`w-3 h-3 rounded-full bg-${p.color}-500`}></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Detalles del Incidente */}
            {step === 2 && (
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Detalles del Incidente</h2>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha del Incidente *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.incidentDate}
                        onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Aproximada
                      </label>
                      <input
                        type="time"
                        value={formData.incidentTime}
                        onChange={(e) => handleInputChange('incidentTime', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección del Incidente *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location.address}
                      onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                      placeholder="Calle, número, colonia"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
                        placeholder="Ciudad"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={formData.location.state}
                        onChange={(e) => handleNestedInputChange('location', 'state', e.target.value)}
                        placeholder="Estado"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Información del Perpetrador */}
            {step === 3 && (
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Información del Agresor</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Esta información es opcional pero ayuda a evaluar el riesgo
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.perpetrator.known}
                        onChange={(e) => handleNestedInputChange('perpetrator', 'known', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Conozco la identidad del agresor
                      </span>
                    </label>
                  </div>

                  {formData.perpetrator.known && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Agresor
                        </label>
                        <input
                          type="text"
                          value={formData.perpetrator.name}
                          onChange={(e) => handleNestedInputChange('perpetrator', 'name', e.target.value)}
                          placeholder="Nombre completo"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Relación con la Víctima
                        </label>
                        <select
                          value={formData.perpetrator.relationship}
                          onChange={(e) => handleNestedInputChange('perpetrator', 'relationship', e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Seleccionar...</option>
                          <option value="PAREJA">Pareja o ex-pareja</option>
                          <option value="FAMILIAR">Familiar</option>
                          <option value="CONOCIDO">Conocido</option>
                          <option value="AUTORIDAD">Autoridad/Funcionario</option>
                          <option value="JEFE">Jefe o supervisor</option>
                          <option value="COLEGA">Compañero de trabajo/escuela</option>
                          <option value="DESCONOCIDO">Desconocido</option>
                          <option value="OTRO">Otro</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del Agresor
                    </label>
                    <textarea
                      value={formData.perpetrator.description}
                      onChange={(e) => handleNestedInputChange('perpetrator', 'description', e.target.value)}
                      rows={3}
                      placeholder="Características físicas, señas particulares, vestimenta..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.perpetrator.hasWeapons}
                        onChange={(e) => handleNestedInputChange('perpetrator', 'hasWeapons', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Porta armas
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.perpetrator.substanceAbuse}
                        onChange={(e) => handleNestedInputChange('perpetrator', 'substanceAbuse', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Abuso de sustancias
                      </span>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 4: Información de la Víctima */}
            {step === 4 && (
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Información de la Víctima</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Esta información ayuda a determinar el apoyo necesario
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.victim.hasInjuries}
                        onChange={(e) => handleNestedInputChange('victim', 'hasInjuries', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Hay lesiones físicas
                      </span>
                    </label>
                  </div>

                  {formData.victim.hasInjuries && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción de las Lesiones
                        </label>
                        <textarea
                          value={formData.victim.injuryDescription}
                          onChange={(e) => handleNestedInputChange('victim', 'injuryDescription', e.target.value)}
                          rows={3}
                          placeholder="Tipo y ubicación de las lesiones..."
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.victim.needsMedicalAttention}
                            onChange={(e) => handleNestedInputChange('victim', 'needsMedicalAttention', e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            Requiere atención médica
                          </span>
                        </label>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Impacto Psicológico
                    </label>
                    <select
                      value={formData.victim.psychologicalImpact}
                      onChange={(e) => handleNestedInputChange('victim', 'psychologicalImpact', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="LEVE">Leve - Puede continuar actividades normales</option>
                      <option value="MODERADO">Moderado - Dificultad para actividades diarias</option>
                      <option value="SEVERO">Severo - Incapacidad para funcionar normalmente</option>
                      <option value="CRITICO">Crítico - Pensamientos de daño propio</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.victim.hasDependents}
                        onChange={(e) => handleNestedInputChange('victim', 'hasDependents', e.target.checked)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Tiene dependientes económicos (hijos, familia)
                      </span>
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Evaluación de Seguridad</h3>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.safetyAssessment.immediateDanger}
                          onChange={(e) => handleNestedInputChange('safetyAssessment', 'immediateDanger', e.target.checked)}
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          ⚠️ Existe peligro inmediato
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.safetyAssessment.needsShelter}
                          onChange={(e) => handleNestedInputChange('safetyAssessment', 'needsShelter', e.target.checked)}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Necesita refugio temporal
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.safetyAssessment.hasEscapePlan}
                          onChange={(e) => handleNestedInputChange('safetyAssessment', 'hasEscapePlan', e.target.checked)}
                          className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Tiene plan de escape
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 5: Revisión y Testigos */}
            {step === 5 && (
              <Card className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Testigos y Revisión Final</h2>

                {/* Testigos */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800">Testigos (Opcional)</h3>
                    <Button type="button" variant="secondary" size="sm" onClick={addWitness}>
                      ➕ Agregar Testigo
                    </Button>
                  </div>

                  {formData.witnesses.length > 0 ? (
                    <div className="space-y-3">
                      {formData.witnesses.map((witness, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-700">Testigo {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeWitness(index)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={witness.name}
                              onChange={(e) => updateWitness(index, 'name', e.target.value)}
                              placeholder="Nombre completo"
                              className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500"
                            />
                            <input
                              type="tel"
                              value={witness.phone}
                              onChange={(e) => updateWitness(index, 'phone', e.target.value)}
                              placeholder="Teléfono"
                              className="px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <textarea
                            value={witness.statement}
                            onChange={(e) => updateWitness(index, 'statement', e.target.value)}
                            rows={2}
                            placeholder="Declaración del testigo..."
                            className="w-full mt-3 px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 text-center py-4 bg-gray-50 rounded-lg">
                      No se han agregado testigos
                    </p>
                  )}
                </div>

                {/* Resumen */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-3">Resumen del Caso</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoría:</span>
                      <span className="font-medium">{categories.find(c => c.id === formData.category)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prioridad:</span>
                      <span className="font-medium">{formData.priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha del Incidente:</span>
                      <span className="font-medium">{new Date(formData.incidentDate).toLocaleDateString('es-MX')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Testigos:</span>
                      <span className="font-medium">{formData.witnesses.length}</span>
                    </div>
                    {formData.safetyAssessment.immediateDanger && (
                      <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-800 font-semibold text-center">
                        ⚠️ CASO DE EMERGENCIA - PELIGRO INMEDIATO
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={prevStep}
                  disabled={loading}
                >
                  ← Anterior
                </Button>
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="ml-auto"
                >
                  Siguiente →
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !canProceed()}
                  className="ml-auto"
                >
                  {loading ? 'Creando Caso...' : '✓ Crear Caso'}
                </Button>
              )}
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default function NuevoCasoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <NuevoCasoForm />
    </Suspense>
  );
}
