'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';

/**
 * Forgot Password Page
 */
export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    
    if (errors.email) {
      setErrors({});
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setEmail('');
        
        // Show development info if available
        if (data.resetUrl) {
          console.log('Reset URL (development):', data.resetUrl);
        }
      } else {
        setErrors({ general: data.error || 'Error al procesar solicitud' });
      }
    } catch (error) {
      setErrors({ general: 'Error al procesar solicitud. Intenta de nuevo' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔑</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-gray-600">
                Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {successMessage ? (
                <div className="text-center">
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">✓ {successMessage}</p>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/auth/login')}
                  >
                    Volver al inicio de sesión
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* General Error */}
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="tu@email.com"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
                  </Button>

                  {/* Back to Login */}
                  <div className="text-center">
                    <a 
                      href="/auth/login" 
                      className="text-sm text-accent hover:text-accentLight font-medium"
                    >
                      ← Volver al inicio de sesión
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
