import { NextResponse } from 'next/server';
import { verifyAuth } from '@/app/lib/auth/jwt';
import dbConnect from '@/app/config/database';
import Issue from '@/app/issues/models/Issue';
import Chat from '@/app/models/Chat';

/**
 * GET /api/dashboard/stats
 * Obtiene estadísticas del dashboard del usuario
 */
export async function GET(request) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.valid) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = authResult.user.id;

    await dbConnect();

    // Obtener casos activos del usuario
    const activeCases = await Issue.countDocuments({
      userId,
      isDeleted: false,
      status: { $nin: ['RESUELTO', 'ARCHIVADO', 'CERRADO'] }
    });

    // Obtener acciones pendientes (casos con alta prioridad o en seguimiento)
    const pendingActions = await Issue.countDocuments({
      userId,
      isDeleted: false,
      $or: [
        { priority: { $in: ['EMERGENCIA', 'CRITICO', 'ALTO'] } },
        { status: 'REQUIERE_ATENCION' },
        { 'followUpActions.completed': false }
      ]
    });

    // Obtener recursos guardados (simulado desde favoritos)
    const savedResources = 0; // Esto se calculará desde localStorage en el cliente

    // Obtener contactos de emergencia del usuario
    const emergencyContacts = 0; // Implementar cuando se cree el modelo de contactos

    // Obtener actividad reciente
    const recentIssues = await Issue.find({
      userId,
      isDeleted: false
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status updatedAt category');

    const recentChats = await Chat.find({
      userId,
      endedAt: { $exists: true }
    })
      .sort({ endedAt: -1 })
      .limit(3)
      .select('endedAt messages');

    const recentActivity = [
      ...recentIssues.map(issue => ({
        icon: getCategoryIcon(issue.category),
        title: `Caso: ${issue.title}`,
        timestamp: formatTimestamp(issue.updatedAt),
        status: getStatusLabel(issue.status)
      })),
      ...recentChats.map(chat => ({
        icon: '💬',
        title: `Consulta legal completada (${chat.messages.length} mensajes)`,
        timestamp: formatTimestamp(chat.endedAt),
        status: 'completed'
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

    // Generar alertas si hay casos urgentes
    const urgentCases = await Issue.find({
      userId,
      isDeleted: false,
      $or: [
        { priority: 'EMERGENCIA' },
        { priority: 'CRITICO' },
        { 'safetyAssessment.immediateDanger': true }
      ]
    }).limit(3);

    const quickAlerts = urgentCases.map(issue => ({
      title: issue.title,
      message: `Caso de ${issue.priority} requiere atención inmediata`,
      action: `/casos/${issue._id}`,
      actionText: 'Ver Caso'
    }));

    return NextResponse.json({
      success: true,
      stats: {
        activeCases,
        pendingActions,
        savedResources,
        emergencyContacts
      },
      recentActivity,
      alerts: quickAlerts
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Error al cargar estadísticas del dashboard' },
      { status: 500 }
    );
  }
}

// Helper functions
function getCategoryIcon(category) {
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
}

function getStatusLabel(status) {
  const labels = {
    NUEVO: 'pending',
    EN_PROCESO: 'in_progress',
    REQUIERE_ATENCION: 'pending',
    EN_REVISION: 'in_progress',
    RESUELTO: 'completed',
    ARCHIVADO: 'completed',
    CERRADO: 'completed'
  };
  return labels[status] || 'pending';
}

function formatTimestamp(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Hace un momento';
  if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;

  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
