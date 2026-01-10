'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';

/**
 * Reset Password Page
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);

  useEffect(() => {
    if (!token) {
      setErrors({ general: 'Token de restablecimiento no válido' });
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (successMessage) {
      setSuccessMessage('');
    }

    // Calculate password strength
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }

    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    let level, label, color;
    if (score <= 2) {
      level = 'weak';
      label = 'Débil';
      color = 'bg-red-500';
    } else if (score <= 4) {
      level = 'medium';
      label = 'Media';
      color = 'bg-yellow-500';
    } else {
      level = 'strong';
      label = 'Fuerte';
      color = 'bg-green-500';
    }

    setPasswordStrength({ score, level, label, color });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'La contraseña es requerida';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setErrors({ general: 'Token de restablecimiento no válido' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setFormData({ newPassword: '', confirmPassword: '' });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          setErrors({ general: data.errors.join(', ') });
        } else {
          setErrors({ general: data.error || 'Error al restablecer contraseña' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Error al restablecer contraseña. Intenta de nuevo' });
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
              <div className="text-6xl mb-4">🔐</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Restablecer Contraseña
              </h1>
              <p className="text-gray-600">
                Ingresa tu nueva contraseña
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
                    Redirigiendo al inicio de sesión...
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* General Error */}
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {/* New Password Field */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                        errors.newPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading || !token}
                    />
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {passwordStrength && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Fortaleza:</span>
                          <span className="text-xs font-medium">{passwordStrength.label}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <p className="mt-2 text-xs text-gray-500">
                      Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading || !token}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isLoading || !token}
                  >
                    {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
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
