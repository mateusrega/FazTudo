import React, { useContext } from "react";
import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { user } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Erro ao fazer login: " + error.message);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <button
        onClick={handleLogin}
        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600"
      >
        Entrar com Google
      </button>
    </div>
  );
};

export default Login;
