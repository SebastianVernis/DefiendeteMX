'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

/**
 * Casos - Sistema de Gestión de Casos Legales
 * Visualización y gestión de todos los casos del usuario
 */
export default function CasosPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCases();
  }, [filter]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);

      const response = await fetch(`/api/issues?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCases(data.issues || []);
      }
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority) => {
    const colors = {
      EMERGENCIA: 'red',
      CRITICO: 'red',
      ALTO: 'orange',
      MEDIO: 'yellow',
      BAJO: 'green'
    };
    return colors[priority] || 'gray';
  };

  const getStatusBadge = (status) => {
    const badges = {
      NUEVO: { text: 'Nuevo', variant: 'info' },
      EN_PROCESO: { text: 'En Proceso', variant: 'warning' },
      REQUIERE_ATENCION: { text: 'Requiere Atención', variant: 'danger' },
      EN_REVISION: { text: 'En Revisión', variant: 'warning' },
      RESUELTO: { text: 'Resuelto', variant: 'success' },
      ARCHIVADO: { text: 'Archivado', variant: 'secondary' },
      CERRADO: { text: 'Cerrado', variant: 'secondary' }
    };
    return badges[status] || { text: status, variant: 'secondary' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      VIOLENCIA_DOMESTICA: '🏠',
      VIOLENCIA_SEXUAL: '⚠️',
      ACOSO_LABORAL: '💼',
      ACOSO_ESCOLAR: '🎓',
      DISCRIMINACION: '⚖️',
      ABUSO_AUTORIDAD: '👮',
      DETENCION_ARBITRARIA: '🔒',
      VIOLACION_DERECHOS: '📜',
      AMENAZAS: '⚡',
      EXTORSION: '💰',
      OTRO: '📋'
    };
    return icons[category] || '📋';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filters = [
    { id: 'all', label: 'Todos', icon: '📋' },
    { id: 'NUEVO', label: 'Nuevos', icon: '🆕' },
    { id: 'EN_PROCESO', label: 'En Proceso', icon: '⚙️' },
    { id: 'REQUIERE_ATENCION', label: 'Urgentes', icon: '🚨' },
    { id: 'RESUELTO', label: 'Resueltos', icon: '✅' }
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  Mis Casos Legales
                </h1>
                <p className="text-gray-600">
                  Gestiona y da seguimiento a todos tus casos
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard">
                  <Button variant="secondary" icon="🏠">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/casos/nuevo">
                  <Button variant="primary" icon="➕">
                    Nuevo Caso
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar casos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <span className="absolute left-4 top-3.5 text-xl">🔍</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                    filter === f.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span className="font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cases Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredCases.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((caso) => (
                <Link key={caso._id} href={`/casos/${caso._id}`}>
                  <Card hover className="h-full">
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCategoryIcon(caso.category)}</span>
                          <Badge variant={getPriorityColor(caso.priority)}>
                            {caso.priority}
                          </Badge>
                        </div>
                        <Badge variant={getStatusBadge(caso.status).variant}>
                          {getStatusBadge(caso.status).text}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                          {caso.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {caso.description}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{formatDate(caso.incidentDate || caso.createdAt)}</span>
                          </div>
                          {caso.evidenceFiles?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span>📎</span>
                              <span>{caso.evidenceFiles.length}</span>
                            </div>
                          )}
                        </div>
                        {caso.safetyAssessment?.immediateDanger && (
                          <div className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                            <span>⚠️</span>
                            Peligro Inmediato
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No hay casos {filter !== 'all' ? 'con este estado' : ''}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Comienza creando tu primer caso'
                  : 'Intenta cambiar el filtro para ver más casos'
                }
              </p>
              <Link href="/casos/nuevo">
                <Button variant="primary" icon="➕">
                  Crear Primer Caso
                </Button>
              </Link>
            </Card>
          )}

          {/* Stats Summary */}
          {!loading && cases.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {cases.length}
                </div>
                <div className="text-sm text-gray-600">Total Casos</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {cases.filter(c => c.priority === 'EMERGENCIA' || c.priority === 'CRITICO').length}
                </div>
                <div className="text-sm text-gray-600">Urgentes</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {cases.filter(c => c.status === 'EN_PROCESO').length}
                </div>
                <div className="text-sm text-gray-600">En Proceso</div>
              </Card>
              <Card className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {cases.filter(c => c.status === 'RESUELTO').length}
                </div>
                <div className="text-sm text-gray-600">Resueltos</div>
              </Card>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
