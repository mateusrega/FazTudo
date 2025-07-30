import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { FaRocket, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro:", err.code, err.message);
      
      const errorMessages = {
        "auth/user-not-found": "Usuário não encontrado",
        "auth/wrong-password": "Senha incorreta",
        "auth/invalid-email": "E-mail inválido",
        "auth/email-already-in-use": "Este e-mail já está em uso",
        "auth/weak-password": "A senha deve ter pelo menos 6 caracteres",
        "auth/invalid-credential": "Credenciais inválidas"
      };
      
      setError(errorMessages[err.code] || `Erro: ${err.message}`);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-md w-full mx-auto">
        {user ? (
          // User is logged in
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 md:p-4 rounded-2xl inline-block mb-4">
                <FaRocket className="text-2xl md:text-3xl text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h1>
              <p className="text-blue-200 text-sm md:text-base px-2">
                Você está logado como <strong>{user.email}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
              >
                Ir para Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-white/10 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border border-white/30 text-sm md:text-base"
              >
                Sair
              </button>
            </div>
          </div>
        ) : (
          // Login/Register form
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-6 md:mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 md:p-4 rounded-2xl inline-block mb-4">
                <FaRocket className="text-3xl md:text-4xl text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">FazTudo</h1>
              <p className="text-blue-200 text-sm md:text-base">Automação Pessoal Inteligente</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm md:text-base" />
                </div>
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm md:text-base" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-white transition-colors text-sm md:text-base" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-white transition-colors text-sm md:text-base" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
              >
                {isLogin ? "Entrar" : "Criar Conta"}
              </button>

              {/* Toggle Login/Register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="text-blue-300 hover:text-white transition-colors underline text-sm md:text-base"
                >
                  {isLogin ? "Não tem conta? Criar nova conta" : "Já tem conta? Fazer login"}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-xs md:text-sm">
                  {error}
                </div>
              )}
            </form>

            {/* Features */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/20">
              <p className="text-center text-blue-200 text-sm mb-4">
                ✨ Recursos disponíveis:
              </p>
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs text-blue-200">
                <div>• Editor Visual</div>
                <div>• WhatsApp Integration</div>
                <div>• Google Sheets</div>
                <div>• Telegram Bots</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}