// src/pages/AdminFeedbacks.jsx
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarEmails, setMostrarEmails] = useState(false);

  const adminUIDs = import.meta.env.VITE_ADMIN_UIDS?.split(",") || [];
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const isAdmin = adminUIDs.includes(user.uid);
    if (!isAdmin) {
      alert("Acesso restrito.");
      navigate("/dashboard");
      return;
    }

    const carregarFeedbacks = async () => {
      const feedbackQuery = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
      const feedbackSnapshot = await getDocs(feedbackQuery);
      const feedbackData = feedbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedbackData);
    };

    const carregarUsuarios = async () => {
      const userSnapshot = await getDocs(collection(db, "users"));
      const map = {};
      userSnapshot.forEach((doc) => {
        const data = doc.data();
        map[doc.id] = data.email || doc.id;
      });
      setUserMap(map);
      setUserCount(userSnapshot.size);
    };

    carregarFeedbacks();
    carregarUsuarios();
  }, [user]);

  const handleMarcarVisto = async (id, valor) => {
    await updateDoc(doc(db, "feedbacks", id), { visto: valor });
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visto: valor } : f))
    );
  };

  const handleFavoritar = async (id, valor) => {
    await updateDoc(doc(db, "feedbacks", id), { favorito: valor });
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorito: valor } : f))
    );
  };

  const filtrarFeedbacks = () => {
    return feedbacks.filter((f) => {
      if (f.visto && categoriaSelecionada !== "Vistos") return false;
      if (!f.visto && categoriaSelecionada === "Vistos") return false;
      if (categoriaSelecionada === "Todos") return true;
      if (categoriaSelecionada === "Favoritos") return f.favorito;
      if (categoriaSelecionada === "Vistos") return f.visto;
      return f.tipo?.toLowerCase() === categoriaSelecionada.toLowerCase();
    });
  };

  const feedbacksFiltrados = filtrarFeedbacks();

  const feedbacksPorDia = feedbacksFiltrados.reduce((acc, f) => {
    const dia = f.createdAt?.toDate().toLocaleDateString() || "Sem data";
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push(f);
    return acc;
  }, {});

  const categorias = ["Elogio", "Sugestão", "Bug"];
  const totalPorCategoria = {
    Todos: feedbacks.filter((f) => !f.visto).length,
    Favoritos: feedbacks.filter((f) => f.favorito && !f.visto).length,
    Vistos: feedbacks.filter((f) => f.visto).length,
    ...Object.fromEntries(
      categorias.map((c) => [
        c,
        feedbacks.filter((f) => f.tipo?.toLowerCase() === c.toLowerCase() && !f.visto).length,
      ])
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 p-4 md:p-6 max-w-4xl">
        <div className="pt-16 lg:pt-0">
          <h1 className="text-2xl font-bold mb-2">📋 Feedbacks Recebidos</h1>
          <p
            onClick={() => setMostrarEmails(!mostrarEmails)}
            className="cursor-pointer text-sm text-gray-600 mb-2"
          >
            👥 Total de usuários registrados: <strong>{userCount}</strong>{" "}
            {mostrarEmails ? "⬆️" : "⬇️"}
          </p>
          {mostrarEmails && (
            <ul className="mb-4 text-sm text-gray-500 list-disc list-inside">
              {Object.values(userMap).map((email, i) => (
                <li key={i}>{email}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2 mb-4 text-sm">
            <button
              onClick={() => setCategoriaSelecionada("Todos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Todos" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Todos ({totalPorCategoria.Todos})
            </button>

            <button
              onClick={() => setMostrarCategorias((v) => !v)}
              className="px-3 py-1 rounded-full border"
            >
              Categoria ⬇️
            </button>

            {mostrarCategorias &&
              categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSelecionada(cat)}
                  className={`px-3 py-1 rounded-full border ${
                    categoriaSelecionada === cat ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {cat} ({totalPorCategoria[cat]})
                </button>
              ))}

            <button
              onClick={() => setCategoriaSelecionada("Favoritos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Favoritos" ? "bg-yellow-400 text-white" : ""
              }`}
            >
              ⭐ Favoritos ({totalPorCategoria.Favoritos})
            </button>

            <button
              onClick={() => setCategoriaSelecionada("Vistos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Vistos" ? "bg-gray-400 text-white" : ""
              }`}
            >
              👁️ Vistos ({totalPorCategoria.Vistos})
            </button>
          </div>
        </div>

        {feedbacksFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum feedback nessa categoria.</p>
        ) : (
          Object.entries(feedbacksPorDia).map(([dia, lista]) => (
            <div key={dia} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{dia}</h2>
              <ul className="space-y-4">
                {lista.map(({ id, userId, mensagem, tipo, createdAt, visto, favorito }) => (
                  <li
                    key={id}
                    className="border p-4 rounded-xl bg-white shadow hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {createdAt?.toDate().toLocaleString() || "Sem data"}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleMarcarVisto(id, !visto)}>
                          {visto ? "👁️" : "🙈"}
                        </button>
                        <button onClick={() => handleFavoritar(id, !favorito)}>
                          {favorito ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-sm mt-1">{tipo?.toUpperCase() || "Tipo?"}</p>
                    <p className="mt-2 text-sm whitespace-pre-line">{mensagem}</p>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      Usuário: {userMap[userId] || userId}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFeedbacks;
