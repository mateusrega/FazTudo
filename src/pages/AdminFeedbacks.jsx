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
import { FaStar, FaRegStar, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [usersMap, setUsersMap] = useState({});
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Feedbacks
        const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          visto: doc.data().visto || false,
          favorito: doc.data().favorito || false,
        }));
        setFeedbacks(data);

        // Usuários
        const userSnapshot = await getDocs(collection(db, "users"));
        const map = {};
        userSnapshot.forEach((doc) => {
          const data = doc.data();
          map[doc.id] = data.email || doc.id;
        });
        setUsersMap(map);

        // Contagem de usuários
        const countSnapshot = await getCountFromServer(collection(db, "users"));
        setUserCount(countSnapshot.data().count);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleToggle = async (id, field) => {
    const index = feedbacks.findIndex((f) => f.id === id);
    if (index === -1) return;

    const updated = [...feedbacks];
    const newValue = !updated[index][field];
    updated[index][field] = newValue;
    setFeedbacks(updated);

    try {
      const docRef = doc(db, "feedbacks", id);
      await updateDoc(docRef, { [field]: newValue });
    } catch (err) {
      console.error(err);
      // Reverter mudança local em caso de erro
      updated[index][field] = !newValue;
      setFeedbacks(updated);
      alert("Erro ao atualizar feedback.");
    }
  };

  // Categorias dinâmicas dos tipos (sem repetição)
  const tiposUnicos = [...new Set(feedbacks.map((f) => f.tipo).filter(Boolean))];

  // Categorias fixas no topo
  const categoriasFixas = ["Favoritos", "Vistos"];

  const categoriasComContagem = [
    ...categoriasFixas.map((cat) => ({
      nome: cat,
      count:
        cat === "Favoritos"
          ? feedbacks.filter((f) => f.favorito).length
          : feedbacks.filter((f) => f.visto).length,
    })),
    ...tiposUnicos.map((tipo) => ({
      nome: tipo,
      count: feedbacks.filter((f) => f.tipo === tipo).length,
    })),
  ];

  // Filtragem dos feedbacks conforme categoria selecionada
  let feedbacksFiltrados = [];

  switch (categoriaSelecionada) {
    case "Favoritos":
      feedbacksFiltrados = feedbacks.filter((f) => f.favorito);
      break;
    case "Vistos":
      feedbacksFiltrados = feedbacks.filter((f) => f.visto);
      break;
    case "Todos":
      feedbacksFiltrados = feedbacks;
      break;
    default:
      feedbacksFiltrados = feedbacks.filter((f) => f.tipo === categoriaSelecionada);
      break;
  }

  // Agrupamento dos feedbacks por data (string)
  const feedbacksPorData = feedbacksFiltrados.reduce((acc, feedback) => {
    const data = feedback.createdAt?.toDate().toLocaleDateString() || "Sem data";
    if (!acc[data]) acc[data] = [];
    acc[data].push(feedback);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 p-4 md:p-6 max-w-5xl">
        <div className="pt-16 lg:pt-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Feedbacks Recebidos</h1>
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            👥 Total de usuários registrados: <strong>{userCount}</strong>
          </p>

          <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Categorias de feedback">
            <button
              onClick={() => setCategoriaSelecionada("Todos")}
              className={`px-3 py-1 rounded-full border ${
                categoriaSelecionada === "Todos"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              role="tab"
              aria-selected={categoriaSelecionada === "Todos"}
              aria-controls="tab-todos"
            >
              Todos ({feedbacks.length})
            </button>

            {categoriasComContagem.map(({ nome, count }) => (
              <button
                key={nome}
                onClick={() => setCategoriaSelecionada(nome)}
                className={`px-3 py-1 rounded-full border ${
                  categoriaSelecionada === nome
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700"
                }`}
                role="tab"
                aria-selected={categoriaSelecionada === nome}
                aria-controls={`tab-${nome.toLowerCase()}`}
              >
                {nome} ({count})
              </button>
            ))}

            {categoriaSelecionada !== "Todos" && (
              <button
                onClick={() => setCategoriaSelecionada("Todos")}
                className="px-3 py-1 rounded-full border bg-gray-200 text-gray-800 ml-auto"
                aria-label="Limpar filtro"
              >
                Limpar filtro
              </button>
            )}
          </div>

          {loading && <p className="text-center text-gray-600 py-6">Carregando feedbacks...</p>}
          {error && <p className="text-center text-red-600 py-6">{error}</p>}

          {!loading && !error && feedbacksFiltrados.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nenhum feedback nesta categoria.</p>
          )}

          {!loading && !error && feedbacksFiltrados.length > 0 && (
            Object.entries(feedbacksPorData).map(([data, items]) => (
              <section
                key={data}
                id={`tab-${categoriaSelecionada.toLowerCase()}`}
                aria-labelledby={`tab-${categoriaSelecionada.toLowerCase()}-label`}
                className="mb-8"
              >
                <h2
                  id={`tab-${categoriaSelecionada.toLowerCase()}-label`}
                  className="text-lg font-semibold text-gray-700 mb-3"
                >
                  {data}
                </h2>
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
                        <p className="font-semibold text-sm md:text-base">{tipo?.toUpperCase() || "N/A"}</p>
                        <div className="flex items-center gap-3 text-gray-500">
                          <button
                            onClick={() => handleToggle(id, "visto")}
                            title={visto ? "Marcar como não visto" : "Marcar como visto"}
                            aria-pressed={visto}
                            aria-label={visto ? "Feedback marcado como visto" : "Marcar feedback como visto"}
                            type="button"
                          >
                            {visto ? <FaCheckCircle className="text-green-500" /> : <FaRegCircle />}
                          </button>
                          <button
                            onClick={() => handleToggle(id, "favorito")}
                            title={favorito ? "Remover dos favoritos" : "Favoritar"}
                            aria-pressed={favorito}
                            aria-label={favorito ? "Feedback favoritado" : "Favoritar feedback"}
                            type="button"
                          >
                            {favorito ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm md:text-base whitespace-pre-line">
                        {mensagem}
                      </div>
                      <p className="text-xs text-gray-500 mt-2 truncate" title={usersMap[userId] || userId}>
                        Usuário: {usersMap[userId] || userId}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminFeedbacks;
