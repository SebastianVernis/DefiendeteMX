'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

/**
 * Login Page
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

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

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">
                Accede a tu cuenta de Defiéndete MX
              </p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <LoginForm />
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Al iniciar sesión, aceptas nuestros{' '}
                <a href="/terminos" className="text-accent hover:underline">
                  Términos de Servicio
                </a>{' '}
                y{' '}
                <a href="/privacidad" className="text-accent hover:underline">
                  Política de Privacidad
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
