'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

/**
 * Login Form Component
 */
export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(null);

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
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
    setAttemptsLeft(null);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        router.push('/');
      } else {
        setErrors({ general: result.error });
        if (result.attemptsLeft !== undefined) {
          setAttemptsLeft(result.attemptsLeft);
        }
      }
    } catch (error) {
      setErrors({ general: 'Error al iniciar sesión. Intenta de nuevo' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
          {attemptsLeft !== null && attemptsLeft > 0 && (
            <p className="text-xs text-red-500 mt-1">
              Intentos restantes: {attemptsLeft}
            </p>
          )}
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
          value={formData.email}
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

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all ${
            errors.password ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="••••••••"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="text-right">
        <a 
          href="/auth/forgot-password" 
          className="text-sm text-accent hover:text-accentLight font-medium"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <a href="/auth/register" className="text-accent hover:text-accentLight font-medium">
          Regístrate aquí
        </a>
      </p>
    </form>
  );
}
