'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';

/**
 * Unified Dashboard - Centro de Control Principal
 * Plataforma unificada de asesoría y gestión legal para emergencias
 */
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingActions: 0,
    savedResources: 0,
    emergencyContacts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickAlerts, setQuickAlerts] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas del usuario
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || stats);
        setRecentActivity(data.recentActivity || []);
        setQuickAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const quickActions = [
    {
      id: 'emergency',
      title: 'Reportar Emergencia',
      description: 'Crear nuevo caso de emergencia legal',
      icon: '🚨',
      color: 'red',
      href: '/casos/nuevo?type=emergency',
      urgent: true
    },
    {
      id: 'case',
      title: 'Nuevo Caso',
      description: 'Registrar un nuevo caso legal',
      icon: '📋',
      color: 'blue',
      href: '/casos/nuevo'
    },
    {
      id: 'evidence',
      title: 'Subir Evidencia',
      description: 'Documentar evidencia de forma segura',
      icon: '📸',
      color: 'purple',
      href: '/evidencia/nueva'
    },
    {
      id: 'chat',
      title: 'Asesoría Legal',
      description: 'Consultar con asistente legal IA',
      icon: '💬',
      color: 'green',
      action: 'openChat'
    },
    {
      id: 'voice',
      title: 'Grabadora',
      description: 'Grabar audio como evidencia',
      icon: '🎙️',
      color: 'indigo',
      href: '/grabador'
    },
    {
      id: 'contacts',
      title: 'Contactos',
      description: 'Red de contactos de emergencia',
      icon: '👥',
      color: 'teal',
      href: '/contactos'
    }
  ];

  const systemFeatures = [
    {
      id: 'cases',
      title: 'Mis Casos',
      description: 'Gestionar y dar seguimiento a casos activos',
      icon: '📁',
      count: stats.activeCases,
      href: '/casos',
      color: 'blue'
    },
    {
      id: 'resources',
      title: 'Recursos Legales',
      description: 'Biblioteca de documentos y guías',
      icon: '📚',
      count: stats.savedResources,
      href: '/recursos',
      color: 'purple'
    },
    {
      id: 'favorites',
      title: 'Favoritos',
      description: 'Contenido guardado para acceso rápido',
      icon: '⭐',
      href: '/favoritos',
      color: 'yellow'
    },
    {
      id: 'constitution',
      title: 'Constitución',
      description: 'Buscar en la Constitución Mexicana',
      icon: '⚖️',
      href: '/constitucion',
      color: 'indigo'
    },
    {
      id: 'scenarios',
      title: 'Escenarios Legales',
      description: 'Guías paso a paso para situaciones comunes',
      icon: '🎯',
      href: '/escenarios',
      color: 'green'
    },
    {
      id: 'reports',
      title: 'Reportes Oficiales',
      description: 'Generar y enviar denuncias a autoridades',
      icon: '📄',
      href: '/reportes',
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-500 hover:bg-red-600',
      blue: 'bg-blue-500 hover:bg-blue-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      green: 'bg-green-500 hover:bg-green-600',
      indigo: 'bg-indigo-500 hover:bg-indigo-600',
      teal: 'bg-teal-500 hover:bg-teal-600',
      yellow: 'bg-yellow-500 hover:bg-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">
                  Centro de Control Legal
                </h1>
                <p className="text-gray-600">
                  Gestión integral para emergencias donde la autoridad no es aliada
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/perfil">
                  <Button variant="secondary" icon="👤">
                    Mi Perfil
                  </Button>
                </Link>
                <Button variant="sos" icon="🚨" onClick={() => window.location.href = 'tel:911'}>
                  Emergencia 911
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Alerts */}
          {quickAlerts.length > 0 && (
            <div className="mb-6">
              {quickAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="glass p-4 rounded-xl border-l-4 border-red-500 mb-3 animate-fadeIn"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                    </div>
                    {alert.action && (
                      <Button size="sm" variant="danger">
                        {alert.actionText || 'Ver'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stats.activeCases}
              </div>
              <div className="text-sm text-gray-600">Casos Activos</div>
            </Card>
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {stats.pendingActions}
              </div>
              <div className="text-sm text-gray-600">Acciones Pendientes</div>
            </Card>
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {stats.savedResources}
              </div>
              <div className="text-sm text-gray-600">Recursos Guardados</div>
            </Card>
            <Card hover className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stats.emergencyContacts}
              </div>
              <div className="text-sm text-gray-600">Contactos</div>
            </Card>
          </div>

          {/* Quick Actions */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>⚡</span>
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action) => (
                action.href ? (
                  <Link key={action.id} href={action.href}>
                    <div className={`${getColorClasses(action.color)} text-white rounded-xl p-5 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl ${action.urgent ? 'ring-4 ring-red-300 animate-pulse' : ''}`}>
                      <div className="text-4xl mb-2">{action.icon}</div>
                      <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                      <p className="text-xs opacity-90">{action.description}</p>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={action.id}
                    onClick={() => {
                      if (action.action === 'openChat') {
                        // Trigger chat widget
                        const chatTrigger = document.querySelector('[data-chat-trigger]');
                        if (chatTrigger) chatTrigger.click();
                      }
                    }}
                    className={`${getColorClasses(action.color)} text-white rounded-xl p-5 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl`}
                  >
                    <div className="text-4xl mb-2">{action.icon}</div>
                    <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                )
              ))}
            </div>
          </section>

          {/* Main Features Grid */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🎯</span>
              Herramientas del Sistema
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemFeatures.map((feature) => (
                <Link key={feature.id} href={feature.href}>
                  <Card hover className="h-full">
                    <div className="flex items-start gap-4">
                      <div className={`${getColorClasses(feature.color)} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-800">{feature.title}</h3>
                          {feature.count !== undefined && (
                            <span className={`${getColorClasses(feature.color)} text-white text-xs px-2 py-1 rounded-full`}>
                              {feature.count}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span>
              Actividad Reciente
            </h2>
            <Card>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{activity.icon || '📌'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 font-medium">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                      {activity.status && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activity.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-5xl mb-3">📭</div>
                  <p>No hay actividad reciente</p>
                  <p className="text-sm mt-1">Comienza creando un nuevo caso o explorando recursos</p>
                </div>
              )}
            </Card>
          </section>

          {/* Emergency Resources Banner */}
          <div className="mt-8 glass p-6 rounded-2xl border-2 border-red-200">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="text-5xl">🆘</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  ¿Necesitas ayuda inmediata?
                </h3>
                <p className="text-gray-600 text-sm">
                  Si estás en peligro inmediato o necesitas asistencia urgente, usa estos recursos
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button variant="sos" icon="📞" onClick={() => window.location.href = 'tel:911'}>
                  Llamar 911
                </Button>
                <Link href="/casos/nuevo?type=emergency">
                  <Button variant="danger" icon="🚨">
                    Reportar Ahora
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
