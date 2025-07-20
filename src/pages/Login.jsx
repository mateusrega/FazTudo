import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // redireciona após login
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Login - FazTudo</h1>

      {user ? (
        <div className="text-center">
          <p className="mb-2">Você já está logado como <strong>{user.email}</strong>.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-green-600 px-4 py-2 rounded mr-2"
          >
            Ir para Dashboard
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
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
}
