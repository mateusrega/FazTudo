import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  getCountFromServer,
  doc,
  updateDoc,
} from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaRegCircle,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
} from "react-icons/fa";

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [usersMap, setUsersMap] = useState({});
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarEmails, setMostrarEmails] = useState(false);

  const navigate = useNavigate();
  const adminUIDs = import.meta.env.VITE_ADMIN_UIDS?.split(",") || [];

  useEffect(() => {
    if (!user) return;

    const isAdmin = adminUIDs.includes(user.uid);
    if (!isAdmin) {
      alert("Acesso restrito.");
      navigate("/dashboard");
      return;
    }

    const fetchFeedbacks = async () => {
      const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        visto: doc.data().visto || false,
        favorito: doc.data().favorito || false,
      }));
      setFeedbacks(data);
    };

    const fetchUsers = async () => {
      const userSnapshot = await getDocs(collection(db, "users"));
      const map = {};
      userSnapshot.forEach((doc) => {
        const data = doc.data();
        map[doc.id] = data.email || doc.id;
      });
      setUsersMap(map);
    };

    const fetchUserCount = async () => {
      const snapshot = await getCountFromServer(collection(db, "users"));
      setUserCount(snapshot.data().count);
    };

    fetchFeedbacks();
    fetchUsers();
    fetchUserCount();
  }, [user]);

  const handleToggle = async (id, field) => {
    const index = feedbacks.findIndex((f) => f.id === id);
    const updated = [...feedbacks];
    const newValue = !updated[index][field];
    updated[index][field] = newValue;
    setFeedbacks(updated);

    const docRef = doc(db, "feedbacks", id);
    await updateDoc(docRef, { [field]: newValue });
  };

  const categorias = Array.from(
    new Set(feedbacks.map((f) => f.tipo).filter((tipo) => !feedbacks.find(f => f.tipo === tipo)?.visto))
  );

  const categoriasComContagem = categorias.map((cat) => ({
    nome: cat,
    count: feedbacks.filter((f) => f.tipo === cat && !f.visto).length,
  }));

  const totalFavoritos = feedbacks.filter((f) => f.favorito && !f.visto).length;
  const totalVistos = feedbacks.filter((f) => f.visto).length;

  const feedbacksFiltrados = feedbacks.filter((f) => {
    if (categoriaSelecionada === "Todos") return !f.visto;
    if (categoriaSelecionada === "Favoritos") return f.favorito && !f.visto;
    if (categoriaSelecionada === "Vistos") return f.visto;
    return f.tipo === categoriaSelecionada && !f.visto;
  });

  const feedbacksPorData = feedbacksFiltrados.reduce((acc, feedback) => {
    const data = feedback.createdAt?.toDate().toLocaleDateString() || "Sem data";
    if (!acc[data]) acc[data] = [];
    acc[data].push(feedback);
    return acc;
  }, {});

  const listaEmails = Object.values(usersMap).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 p-4 md:p-6 max-w-5xl">
        <div className="pt-16 lg:pt-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Feedbacks Recebidos</h1>
          <p className="text-gray-600 mb-4 text-sm md:text-base flex items-center gap-2">
            👥 Total de usuários registrados: <strong>{userCount}</strong>
            <button
              className="text-blue-600 hover:underline text-sm flex items-center"
              onClick={() => setMostrarEmails(!mostrarEmails)}
            >
              <FaUsers className="mr-1" />
              {mostrarEmails ? "Ocultar e-mails" : "Mostrar e-mails"}
            </button>
          </p>

          {mostrarEmails && (
            <ul className="bg-white border rounded p-4 mb-4 max-h-64 overflow-y-auto text-sm text-gray-600">
              {listaEmails.map((email, index) => (
                <li key={index}>{email}</li>
              ))}
            </ul>
          )}

          <div className="mb-4">
            <button
              onClick={() => setMostrarCategorias(!mostrarCategorias)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              {mostrarCategorias ? <FaChevronUp /> : <FaChevronDown />}
              {categoriaSelecionada}
            </button>

            {mostrarCategorias && (
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => setCategoriaSelecionada("Todos")}
                  className={`px-3 py-1 rounded-full border ${
                    categoriaSelecionada === "Todos" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  Todos ({feedbacks.filter((f) => !f.visto).length})
                </button>
                <button
                  onClick={() => setCategoriaSelecionada("Favoritos")}
                  className={`px-3 py-1 rounded-full border ${
                    categoriaSelecionada === "Favoritos" ? "bg-yellow-400 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  ⭐ Favoritos ({totalFavoritos})
                </button>
                <button
                  onClick={() => setCategoriaSelecionada("Vistos")}
                  className={`px-3 py-1 rounded-full border ${
                    categoriaSelecionada === "Vistos" ? "bg-green-500 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  👁️ Vistos ({totalVistos})
                </button>
                {categoriasComContagem.map(({ nome, count }) => (
                  <button
                    key={nome}
                    onClick={() => setCategoriaSelecionada(nome)}
                    className={`px-3 py-1 rounded-full border ${
                      categoriaSelecionada === nome ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    {nome} ({count})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {feedbacksFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum feedback nesta categoria.</p>
        ) : (
          Object.entries(feedbacksPorData).map(([data, items]) => (
            <div key={data} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">{data}</h2>
              <ul className="space-y-4">
                {items.map(({ id, userId, mensagem, tipo, createdAt, visto, favorito }) => (
                  <li
                    key={id}
                    className="border p-4 md:p-6 rounded-xl shadow bg-white hover:shadow-md transition-all relative"
                  >
                    <p className="text-xs text-gray-400">
                      {createdAt?.toDate().toLocaleString() || "Sem data"}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-sm md:text-base">{tipo?.toUpperCase() || "Sem categoria"}</p>
                      <div className="flex items-center gap-3 text-gray-500">
                        <button onClick={() => handleToggle(id, "visto")} title="Marcar como visto">
                          {visto ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle />}
                        </button>
                        <button onClick={() => handleToggle(id, "favorito")} title="Favoritar">
                          {favorito ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm md:text-base whitespace-pre-wrap">{mensagem}</p>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      Usuário: {usersMap[userId] || userId}
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
