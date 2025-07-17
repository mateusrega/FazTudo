// src/pages/Login.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext); // adiciona setUser

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  const entrarComoTeste = () => {
    // Define um usuário de teste falso
    setUser({
      uid: "teste123",
      email: "teste@faztudo.app",
      displayName: "Usuário de Teste",
      isTestUser: true,
    });
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">🌱 Bem-vindo ao FazTudo</h1>
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all w-full mb-4"
        >
          Entrar com Google
        </button>

        <button
          onClick={entrarComoTeste}
          className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition-all w-full"
        >
          Entrar como teste
        </button>
      </div>
    </div>
  );
};

export default Login;
