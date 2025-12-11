'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';

/**
 * User Profile Page
 * Allows users to view and edit their profile information
 */
export default function PerfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'security'

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/perfil');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear success message
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateInfoForm = () => {
    const newErrors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSecurityForm = () => {
    const newErrors = {};

    if (formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Ingresa tu contraseña actual';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'Ingresa una nueva contraseña';
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    
    if (!validateInfoForm()) {
      return;
    }

    setIsUpdating(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const result = await updateUser({
        fullName: formData.fullName,
        phone: formData.phone || undefined
      });

      if (result.success) {
        setSuccessMessage('Perfil actualizado exitosamente');
      } else {
        setErrors({ general: result.error || 'Error al actualizar perfil' });
      }
    } catch (error) {
      setErrors({ general: 'Error al actualizar perfil. Intenta de nuevo' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (!validateSecurityForm()) {
      return;
    }

    setIsUpdating(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Contraseña actualizada exitosamente');
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
      } else {
        setErrors({ general: data.error || 'Error al actualizar contraseña' });
      }
    } catch (error) {
      setErrors({ general: 'Error al actualizar contraseña. Intenta de nuevo' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Mi Perfil
              </h1>
              <p className="text-gray-600">
                Gestiona tu información personal y configuración de seguridad
              </p>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accentLight rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
                  <p className="text-gray-600">{user?.email}</p>
                  {user?.isPremium && (
                    <span className="inline-block mt-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-semibold rounded-full">
                      ⭐ Premium
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'text-accent border-b-2 border-accent bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  📋 Información Personal
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'security'
                      ? 'text-accent border-b-2 border-accent bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  🔒 Seguridad
                </button>
              </div>

              <div className="p-8">
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">✓ {successMessage}</p>
                  </div>
                )}

                {/* General Error */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Information Tab */}
                {activeTab === 'info' && (
                  <form onSubmit={handleUpdateInfo} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isUpdating}
                      />
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        disabled
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        El email no puede ser modificado
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono <span className="text-gray-400">(opcional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="5512345678"
                        disabled={isUpdating}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <form onSubmit={handleUpdatePassword} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña Actual
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                          errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        disabled={isUpdating}
                      />
                      {errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                      )}
                    </div>

                    {/* New Password */}
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
                        disabled={isUpdating}
                      />
                      {errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">
                        Mínimo 8 caracteres, incluye mayúsculas, minúsculas, números y símbolos
                      </p>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={formData.confirmNewPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
                          errors.confirmNewPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        disabled={isUpdating}
                      />
                      {errors.confirmNewPassword && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
