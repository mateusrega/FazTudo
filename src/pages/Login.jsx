import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function Login() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // limpa erro anterior
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao logar:", err.code, err.message);
      if (err.code === "auth/user-not-found") {
        setError("Usuário não encontrado");
      } else if (err.code === "auth/wrong-password") {
        setError("Senha incorreta");
      } else if (err.code === "auth/invalid-email") {
        setError("E-mail inválido");
      } else {
        setError("Erro ao logar: " + err.message);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleRegister = async () => {
    setError(""); // limpa erro anterior
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro ao criar conta:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso");
      } else if (err.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres");
      } else if (err.code === "auth/invalid-email") {
        setError("E-mail inválido");
      } else {
        setError("Erro ao criar conta: " + err.message);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Login - FazTudo</h1>

      {user ? (
        <div className="text-center">
          <p className="mb-2">
            Você já está logado como <strong>{user.email}</strong>.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 px-4 py-2 rounded mr-2"
          >
            Início
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="bg-gray-800 p-6 rounded shadow-md w-80">
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-4 p-2 rounded bg-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 w-full py-2 rounded">
            Entrar
          </button>

          {/* botão de cadastro */}
          <button
            type="button"
            onClick={handleRegister}
            className="mt-3 w-full text-sm text-blue-400 underline"
          >
            Criar nova conta
          </button>

          {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
        </form>
      )}
    </div>
  );
}
