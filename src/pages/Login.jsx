// src/pages/Login.jsx
import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate(); // usado para redirecionar no modo teste

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  const entrarComoTeste = () => {
    // Define usuário de teste
    setUser({
      uid: "teste123",
      email: "teste@faztudo.app",
      displayName: "Usuário de Teste",
      isTestUser: true,
    });
    navigate("/dashboard");
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <div className="text-center w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">🌱 Bem-vindo ao FazTudo</h1>
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-all w-full mb-4"
        >
          Entrar com Google
        </button>

        <button
          onClick={entrarComoTeste}
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-all w-full"
        >
          Entrar como Teste
        </button>
      </div>
    </div>
  );
};

export default Login;
