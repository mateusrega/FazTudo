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
} from "react-icons/fa";

const removerAcentos = (str) =>
  str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [usersMap, setUsersMap] = useState({});
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [categoriasAbertas, setCategoriasAbertas] = useState(false);
  const [usuariosAbertos, setUsuariosAbertos] = useState(false);

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

  const categoriasFixas = ["Elogio", "Sugestao", "Bug"];
  const contagemPorCategoria = (categoria) =>
    feedbacks.filter(
      (f) =>
        removerAcentos(f.tipo || "") === removerAcentos(categoria) &&
        !f.visto
    ).length;

  const feedbacksVisiveis = feedbacks.filter((f) => {
    if (categoriaSelecionada === "Todos") return !f.visto;
    if (categoriaSelecionada === "Favoritos") return f.favorito && !f.visto;
    if (categoriaSelecionada === "Vistos") return f.visto;
    return (
      removerAcentos(f.tipo || "") === removerAcentos(categoriaSelecionada) &&
      !f.visto
    );
  });

  const feedbacksPorData = feedbacksVisiveis.reduce((acc, feedback) => {
    const data = feedback.createdAt?.toDate().toLocaleDateString() || "Sem data";
    if (!acc[data]) acc[data] = [];
    acc[data].push(feedback);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 p-4 md:p-6 max-w-5xl">
        <div className="pt-16 lg:pt-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Feedbacks Recebidos</h1>
          <p
            onClick={() => setUsuariosAbertos((prev) => !prev)}
            className="text-gray-600 mb-4 text-sm md:text-base cursor-pointer flex items-center gap-2"
          >
            👥 Total de usuários registrados: <strong>{userCount}</strong>
            {usuariosAbertos ? <FaChevronUp /> : <FaChevronDown />}
          </p>
          {usuariosAbertos && (
            <ul className="mb-4 text-sm text-gray-700 list-disc list-inside">
              {Object.values(usersMap).map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setCategoriaSelecionada("Todos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Todos" ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              Todos ({feedbacks.filter((f) => !f.visto).length})
            </button>

            <button
              onClick={() => setCategoriasAbertas(!categoriasAbertas)}
              className="px-3 py-1 rounded-full border bg-white text-gray-700 flex items-center gap-1"
            >
              Categoria {categoriasAbertas ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {categoriasAbertas &&
              categoriasFixas.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaSelecionada(cat)}
                  className={`px-3 py-1 rounded-full border ${
                    categoriaSelecionada === cat ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {cat} ({contagemPorCategoria(cat)})
                </button>
              ))}

            <button
              onClick={() => setCategoriaSelecionada("Favoritos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Favoritos" ? "bg-yellow-400 text-white" : "bg-white text-gray-700"
              }`}
            >
              ⭐ Favoritos ({feedbacks.filter((f) => f.favorito && !f.visto).length})
            </button>

            <button
              onClick={() => setCategoriaSelecionada("Vistos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Vistos" ? "bg-green-500 text-white" : "bg-white text-gray-700"
              }`}
            >
              👁️ Vistos ({feedbacks.filter((f) => f.visto).length})
            </button>
          </div>
        </div>

        {feedbacksVisiveis.length === 0 ? (
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
                      <p className="font-semibold text-sm md:text-base">{tipo?.toUpperCase() || "SEM CATEGORIA"}</p>
                      <div className="flex items-center gap-3 text-gray-500">
                        <button onClick={() => handleToggle(id, "visto")} title="Marcar como visto">
                          {visto ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle />}
                        </button>
                        <button onClick={() => handleToggle(id, "favorito")} title="Favoritar">
                          {favorito ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm md:text-base whitespace-pre-wrap break-words">
                      {mensagem}
                    </p>
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
