'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children, requireVerified = false, requireRole = null }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/auth/login');
        return;
      }

      // Check if email verification is required
      if (requireVerified && !user.isVerified) {
        router.push('/auth/verify-email');
        return;
      }

      // Check if specific role is required
      if (requireRole) {
        const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
        if (!allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requireVerified, requireRole, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check verification requirement
  if (requireVerified && !user.isVerified) {
    return null;
  }

  // Check role requirement
  if (requireRole) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(user.role)) {
      return null;
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
}
