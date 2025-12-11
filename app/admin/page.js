'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * Admin Dashboard
 * Comprehensive admin panel for managing the platform
 */
export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is admin (you'll need to implement proper auth check)
    checkAdminAuth();
    loadDashboardStats();
  }, []);

  const checkAdminAuth = async () => {
    // TODO: Implement proper admin authentication check
    // For now, just a placeholder
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        if (user.role !== 'ADMIN') {
          router.push('/');
        }
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      const mockStats = {
        users: {
          total: 1250,
          active: 890,
          new: 45,
          premium: 120
        },
        issues: {
          total: 3450,
          open: 234,
          closed: 3100,
          critical: 12
        },
        resources: {
          downloads: 8920,
          favorites: 2340,
          shares: 1567
        },
        scenarios: {
          views: 15680,
          searches: 4320,
          favorites: 1890
        },
        notifications: {
          sent: 12450,
          delivered: 11890,
          failed: 560,
          pending: 45
        },
        chat: {
          sessions: 5670,
          messages: 23450,
          avgRating: 4.6,
          crisisDetections: 23
        }
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-20 bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-600">Cargando dashboard...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Panel de Administración
                </h1>
                <p className="text-indigo-100">
                  Dashboard completo de Defiéndete MX
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
              >
                ← Volver al sitio
              </Button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4">
              {[
                { id: 'overview', label: '📊 Overview', icon: '📊' },
                { id: 'users', label: '👥 Usuarios', icon: '👥' },
                { id: 'issues', label: '📋 Casos', icon: '📋' },
                { id: 'content', label: '📚 Contenido', icon: '📚' },
                { id: 'notifications', label: '🔔 Notificaciones', icon: '🔔' },
                { id: 'chat', label: '💬 Chatbot', icon: '💬' },
                { id: 'settings', label: '⚙️ Configuración', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Métricas Clave</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card variant="gradient" className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">👥</div>
                        <Badge variant="primary" size="sm">+{stats.users.new} nuevos</Badge>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.users.total.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Total Usuarios</p>
                      <div className="mt-4 text-sm text-gray-500">
                        {stats.users.active} activos
                      </div>
                    </Card>

                    <Card variant="gradient" className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📋</div>
                        <Badge variant="primary" size="sm" className="bg-orange-600">
                          {stats.issues.open} abiertos
                        </Badge>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.issues.total.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Total Casos</p>
                      <div className="mt-4 text-sm text-red-600 font-medium">
                        {stats.issues.critical} críticos
                      </div>
                    </Card>

                    <Card variant="gradient" className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">📚</div>
                        <Badge variant="primary" size="sm" className="bg-green-600">
                          {stats.resources.shares} shares
                        </Badge>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.resources.downloads.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Descargas de Recursos</p>
                      <div className="mt-4 text-sm text-gray-500">
                        {stats.resources.favorites} favoritos
                      </div>
                    </Card>

                    <Card variant="gradient" className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">💬</div>
                        <Badge variant="primary" size="sm" className="bg-purple-600">
                          ⭐ {stats.chat.avgRating}
                        </Badge>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">
                        {stats.chat.sessions.toLocaleString()}
                      </h3>
                      <p className="text-gray-600 text-sm">Sesiones de Chat</p>
                      <div className="mt-4 text-sm text-red-600 font-medium">
                        🚨 {stats.chat.crisisDetections} crisis detectadas
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Notifications Status */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado de Notificaciones</h2>
                  <Card variant="glass" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {stats.notifications.sent.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Enviadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">
                          {stats.notifications.delivered.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Entregadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 mb-1">
                          {stats.notifications.failed}
                        </div>
                        <div className="text-sm text-gray-600">Fallidas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-1">
                          {stats.notifications.pending}
                        </div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="primary" fullWidth>
                      📧 Enviar Notificación Masiva
                    </Button>
                    <Button variant="secondary" fullWidth>
                      📊 Generar Reporte
                    </Button>
                    <Button variant="secondary" fullWidth>
                      🔄 Sincronizar Datos
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Usuarios</h2>
                <Card variant="glass" className="p-6">
                  <p className="text-gray-600 mb-4">
                    Panel de gestión de usuarios - implementar tabla con filtros, búsqueda y acciones.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <div>
                        <div className="font-semibold">Total de usuarios</div>
                        <div className="text-2xl font-bold text-indigo-600">{stats.users.total}</div>
                      </div>
                      <Button variant="primary" size="sm">Ver Todos</Button>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                      <div>
                        <div className="font-semibold">Usuarios Premium</div>
                        <div className="text-2xl font-bold text-purple-600">{stats.users.premium}</div>
                      </div>
                      <Button variant="primary" size="sm">Gestionar</Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'issues' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Casos</h2>
                <Card variant="glass" className="p-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Card className="flex-1 p-4 text-center">
                        <div className="text-sm text-gray-600 mb-1">Casos Abiertos</div>
                        <div className="text-3xl font-bold text-orange-600">{stats.issues.open}</div>
                      </Card>
                      <Card className="flex-1 p-4 text-center">
                        <div className="text-sm text-gray-600 mb-1">Casos Críticos</div>
                        <div className="text-3xl font-bold text-red-600">{stats.issues.critical}</div>
                      </Card>
                      <Card className="flex-1 p-4 text-center">
                        <div className="text-sm text-gray-600 mb-1">Casos Cerrados</div>
                        <div className="text-3xl font-bold text-green-600">{stats.issues.closed}</div>
                      </Card>
                    </div>
                    <Button variant="primary" fullWidth>
                      Ver Todos los Casos
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Contenido</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card variant="glass" className="p-6">
                    <h3 className="text-xl font-bold mb-4">📋 Escenarios</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Total vistas:</span>
                        <span className="font-bold">{stats.scenarios.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Búsquedas:</span>
                        <span className="font-bold">{stats.scenarios.searches.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Favoritos:</span>
                        <span className="font-bold">{stats.scenarios.favorites.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth size="sm">
                      Gestionar Escenarios
                    </Button>
                  </Card>

                  <Card variant="glass" className="p-6">
                    <h3 className="text-xl font-bold mb-4">📚 Recursos</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Descargas:</span>
                        <span className="font-bold">{stats.resources.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compartidos:</span>
                        <span className="font-bold">{stats.resources.shares.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Favoritos:</span>
                        <span className="font-bold">{stats.resources.favorites.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button variant="primary" fullWidth size="sm">
                      Gestionar Recursos
                    </Button>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'chat' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas del Chatbot</h2>
                <Card variant="glass" className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Total de Sesiones</div>
                      <div className="text-4xl font-bold text-indigo-600 mb-2">
                        {stats.chat.sessions.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stats.chat.messages.toLocaleString()} mensajes totales
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Calificación Promedio</div>
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        ⭐ {stats.chat.avgRating}
                      </div>
                      <div className="text-sm text-gray-500">
                        Basado en opiniones de usuarios
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🚨</span>
                      <h4 className="font-bold text-red-900">Crisis Detectadas</h4>
                    </div>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {stats.chat.crisisDetections}
                    </div>
                    <p className="text-sm text-red-800">
                      Situaciones de emergencia identificadas automáticamente
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4 bg-red-600 hover:bg-red-700"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {['notifications', 'settings'].includes(activeTab) && (
              <Card variant="glass" className="p-12 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Sección en Desarrollo
                </h3>
                <p className="text-gray-600">
                  Esta funcionalidad estará disponible próximamente
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
