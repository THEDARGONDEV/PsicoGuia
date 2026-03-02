import React, { useState, useEffect } from 'react';
import { X, LogIn, LogOut, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isAuthenticated: boolean;
  username: string | null;
  onLogin: (username: string, remember: boolean) => void;
  onLogout: () => void;
}

export default function MinimalAuth({ isAuthenticated, username, onLogin, onLogout }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [inputUsername, setInputUsername] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear messages when switching modes or closing modal
  useEffect(() => {
    if (!isModalOpen) {
      setError(null);
      setSuccess(null);
      setInputUsername('');
      setInputEmail('');
      setInputPassword('');
    }
  }, [isModalOpen, isLoginMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      if (isLoginMode) {
        // LOGIN LOGIC
        const storedUser = localStorage.getItem(`user_data_${inputUsername}`);
        
        if (!storedUser) {
          setError('Usuario no encontrado. Crea una cuenta primero.');
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.password !== inputPassword) {
          setError('Contraseña incorrecta.');
          setIsLoading(false);
          return;
        }

        // Login successful
        onLogin(inputUsername, rememberMe);
        setIsModalOpen(false);

      } else {
        // REGISTRATION LOGIC
        const existingUser = localStorage.getItem(`user_data_${inputUsername}`);
        
        if (existingUser) {
          setError('Este nombre de usuario ya existe.');
          setIsLoading(false);
          return;
        }

        if (inputPassword.length < 4) {
          setError('La contraseña es muy corta.');
          setIsLoading(false);
          return;
        }

        // Save new user
        const newUser = {
          username: inputUsername,
          email: inputEmail,
          password: inputPassword,
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem(`user_data_${inputUsername}`, JSON.stringify(newUser));
        
        setSuccess('¡Cuenta creada! Iniciando sesión...');
        
        // Auto login after registration
        setTimeout(() => {
          onLogin(inputUsername, rememberMe);
          setIsModalOpen(false);
        }, 1000);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button - Minimalist Top Left */}
      {!isAuthenticated ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-6 left-6 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors duration-300 flex items-center gap-2 z-50"
          aria-label="Iniciar Sesión"
        >
          <User size={24} />
        </button>
      ) : (
        <div className="absolute top-6 left-6 z-50 animate-fade-in">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
              {username}
            </span>
            <button 
              onClick={onLogout}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isLoginMode ? 'Bienvenido' : 'Crear cuenta'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isLoginMode ? 'Ingresa tus datos para continuar' : 'Regístrate para guardar tu progreso'}
              </p>
            </div>

            {/* Minimalist Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={14} />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Usuario</label>
                <input 
                  type="text" 
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  required
                  className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                  placeholder="Tu nombre de usuario"
                />
              </div>

              {!isLoginMode && (
                <div className="space-y-1 animate-fade-in">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Correo</label>
                  <input 
                    type="email" 
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    required
                    className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Contraseña</label>
                <input 
                  type="password" 
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  required
                  className="w-full border-b border-gray-200 py-2 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 accent-black cursor-pointer rounded-sm"
                />
                <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">
                  Recordar sesión
                </label>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white text-sm font-medium tracking-wide py-3.5 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-black/10 mt-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs text-gray-400 hover:text-black transition-colors"
              >
                {isLoginMode ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
