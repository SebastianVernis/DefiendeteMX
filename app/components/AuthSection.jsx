"use client";
import { useState } from "react";
import UserMenu from "./UserMenu";

export default function AuthSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulated authentication - JWT ready structure
    const mockUser = {
      id: "user_" + Date.now(),
      name: formData.name || formData.email.split("@")[0],
      email: formData.email,
      token: "mock_jwt_token_" + Date.now(),
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    
    // In production, store token in localStorage/cookies
    // localStorage.setItem('authToken', mockUser.token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setFormData({ email: "", password: "", name: "" });
    // localStorage.removeItem('authToken');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isAuthenticated && user) {
    return (
      <div className="w-full bg-primary border-b border-secondary">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-accent text-xl font-bold">⚖️</span>
            <span className="text-textPrimary font-semibold hidden sm:inline">Defiéndete MX</span>
          </div>
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-primary via-background to-primary py-8 px-4 border-b border-secondary">
      <div className="max-w-md mx-auto">
        <div className="bg-primary/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-secondary p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
              <span className="text-3xl">⚖️</span>
            </div>
            <h2 className="text-2xl font-bold text-textPrimary mb-2">
              {showLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="text-textSecondary text-sm">
              {showLogin
                ? "Accede a todas las herramientas legales"
                : "Regístrate para proteger tus derechos"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!showLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-textPrimary mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!showLogin}
                  className="w-full px-4 py-3 bg-background border border-secondary rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                  placeholder="Juan Pérez"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-textPrimary mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-background border border-secondary rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-textPrimary mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-background border border-secondary rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {showLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="text-sm text-accent hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              {showLogin
                ? "¿No tienes cuenta? Regístrate aquí"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-secondary">
            <p className="text-xs text-textSecondary text-center">
              🔒 Tus datos están protegidos. Usamos encriptación de nivel bancario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
