// src/pages/Login.jsx
import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  const entrarModoEmergencia = () => {
    // Apenas redireciona para o builder sem autenticação
    navigate("/builder");
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">🌱 Bem-vindo ao FazTudo</h1>
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all w-full"
        >
          Entrar com Google
        </button>

        <button
          onClick={entrarModoEmergencia}
          className="mt-4 bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-all w-full"
        >
          Acessar modo de emergência
        </button>
      </div>
    </div>
  );
};

export default Login;
