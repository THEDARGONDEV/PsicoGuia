import React, { useState, useEffect } from 'react';
import { X, LogIn, LogOut, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

interface Props {
  isAuthenticated: boolean;
  username: string | null;
  onLogin: (username: string, remember: boolean) => void; // Kept for compatibility, but managed by Firebase listener in App
  onLogout: () => void; // Kept for compatibility
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

    try {
      if (isLoginMode) {
        // LOGIN LOGIC
        // Use email for login if provided, otherwise assume username is email (or handle username login separately if needed)
        // For simplicity, let's assume the input is email for now, or we can try to find user by username (complex in Firebase).
        // Let's stick to email for Firebase Auth.
        
        // If user entered a username in the "Usuario" field (which is inputUsername), we might have a problem if they didn't enter email.
        // The original code had "Usuario" field for login. Firebase needs Email.
        // Let's change the UI to ask for Email in Login mode too, or use inputUsername as email.
        
        const emailToUse = inputEmail || inputUsername; // Fallback if they put email in username field
        
        if (!emailToUse.includes('@')) {
           setError('Por favor ingresa un correo electrónico válido.');
           setIsLoading(false);
           return;
        }

        await signInWithEmailAndPassword(auth, emailToUse, inputPassword);
        
        // Login successful - onAuthStateChanged in App.tsx will handle state update
        setIsModalOpen(false);

      } else {
        // REGISTRATION LOGIC
        if (inputPassword.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.');
          setIsLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
        
        // Update profile with username
        if (userCredential.user) {
            await updateProfile(userCredential.user, {
                displayName: inputUsername
            });
        }
        
        setSuccess('¡Cuenta creada! Iniciando sesión...');
        
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido.');
      } else if (err.code === 'auth/user-disabled') {
        setError('El usuario ha sido deshabilitado.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuario no encontrado.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Contraseña incorrecta.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        setError('Error de configuración: Habilita "Email/Password" en la consola de Firebase (Authentication > Sign-in method).');
      } else {
        setError('Ocurrió un error: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
      try {
          await signOut(auth);
          onLogout();
      } catch (error) {
          console.error("Error signing out: ", error);
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
              {username || 'Usuario'}
            </span>
            <button 
              onClick={handleSignOut}
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
              
              {/* Username field - Only for Registration or as fallback for Login if needed, but let's prioritize Email for Firebase */}
              {!isLoginMode && (
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
              )}

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

              {/* Remember Me - Firebase handles persistence automatically, but we can keep UI */}
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 accent-black cursor-pointer rounded-sm"
                />
                <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer select-none">
                  Mantener sesión iniciada
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
