import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  FaStar, 
  FaRegStar, 
  FaEye, 
  FaEyeSlash, 
  FaUsers, 
  FaChevronDown, 
  FaChevronUp,
  FaHeart,
  FaLightbulb,
  FaBug,
  FaFilter,
  FaCalendarAlt
} from "react-icons/fa";

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [userCount, setUserCount] = useState(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [mostrarEmails, setMostrarEmails] = useState(false);
  const [loading, setLoading] = useState(true);

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

    const carregarDados = async () => {
      try {
        // Carregar feedbacks
        const feedbackQuery = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const feedbackData = feedbackSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(feedbackData);

        // Carregar usuários
        const userSnapshot = await getDocs(collection(db, "users"));
        const map = {};
        userSnapshot.forEach((doc) => {
          const data = doc.data();
          map[doc.id] = data.email || doc.id;
        });
        setUserMap(map);
        setUserCount(userSnapshot.size);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [user]);

  const handleMarcarVisto = async (id, valor) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), { visto: valor });
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, visto: valor } : f))
      );
    } catch (error) {
      console.error("Erro ao marcar como visto:", error);
    }
  };

  const handleFavoritar = async (id, valor) => {
    try {
      await updateDoc(doc(db, "feedbacks", id), { favorito: valor });
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, favorito: valor } : f))
      );
    } catch (error) {
      console.error("Erro ao favoritar:", error);
    }
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
    const dia = f.createdAt?.toDate().toLocaleDateString('pt-BR') || "Sem data";
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

  const getTipoIcon = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'elogio': return <FaHeart className="text-pink-500" />;
      case 'sugestao': return <FaLightbulb className="text-yellow-500" />;
      case 'bug': 
      case 'erro': return <FaBug className="text-red-500" />;
      default: return <FaLightbulb className="text-gray-500" />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'elogio': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'sugestao': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bug': 
      case 'erro': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:ml-64 p-4 md:p-6">
          <div className="pt-16 lg:pt-0 flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando feedbacks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 p-4 md:p-6">
        <div className="pt-16 lg:pt-0 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Painel de Feedbacks
                </h1>
                <p className="text-gray-600">Gerencie e responda aos feedbacks dos usuários</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{userCount}</p>
                  </div>
                  <FaUsers className="text-blue-500 text-xl" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Feedbacks</p>
                    <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
                  </div>
                  <FaFilter className="text-green-500 text-xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Não Lidos</p>
                    <p className="text-2xl font-bold text-orange-600">{totalPorCategoria.Todos}</p>
                  </div>
                  <FaEyeSlash className="text-orange-500 text-xl" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Favoritos</p>
                    <p className="text-2xl font-bold text-yellow-600">{totalPorCategoria.Favoritos}</p>
                  </div>
                  <FaStar className="text-yellow-500 text-xl" />
                </div>
              </div>
            </div>

            {/* User List Toggle */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-4">
              <button
                onClick={() => setMostrarEmails(!mostrarEmails)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <FaUsers className="text-blue-500" />
                  <span className="font-medium text-gray-900">Lista de Usuários Registrados</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {userCount}
                  </span>
                </div>
                {mostrarEmails ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              
              {mostrarEmails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {Object.values(userMap).map((email, i) => (
                      <div key={i} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700">
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-gray-500" />
              <h3 className="font-semibold text-gray-900">Filtros</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoriaSelecionada("Todos")}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                  categoriaSelecionada === "Todos" 
                    ? "bg-blue-500 text-white border-blue-500 shadow-md" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                }`}
              >
                Todos
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {totalPorCategoria.Todos}
                </span>
              </button>

              <button
                onClick={() => setMostrarCategorias(!mostrarCategorias)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:border-blue-300 transition-all duration-200 flex items-center gap-2"
              >
                Por Categoria
                {mostrarCategorias ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {mostrarCategorias && (
                <>
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoriaSelecionada(cat)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                        categoriaSelecionada === cat 
                          ? "bg-blue-500 text-white border-blue-500 shadow-md" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      {getTipoIcon(cat)}
                      {cat}
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {totalPorCategoria[cat]}
                      </span>
                    </button>
                  ))}
                </>
              )}

              <button
                onClick={() => setCategoriaSelecionada("Favoritos")}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                  categoriaSelecionada === "Favoritos" 
                    ? "bg-yellow-500 text-white border-yellow-500 shadow-md" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-yellow-300"
                }`}
              >
                <FaStar />
                Favoritos
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {totalPorCategoria.Favoritos}
                </span>
              </button>

              <button
                onClick={() => setCategoriaSelecionada("Vistos")}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                  categoriaSelecionada === "Vistos" 
                    ? "bg-gray-500 text-white border-gray-500 shadow-md" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-300"
                }`}
              >
                <FaEye />
                Vistos
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {totalPorCategoria.Vistos}
                </span>
              </button>
            </div>
          </div>

          {/* Feedbacks */}
          {feedbacksFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-gray-200 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaFilter className="text-2xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum feedback encontrado
              </h3>
              <p className="text-gray-600">
                Não há feedbacks na categoria "{categoriaSelecionada}" no momento.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(feedbacksPorDia).map(([dia, lista]) => (
                <div key={dia} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 md:px-6 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-500 text-sm" />
                      <h2 className="text-lg font-semibold text-gray-900">{dia}</h2>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {lista.length} feedback{lista.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {lista.map(({ id, userId, mensagem, tipo, createdAt, visto, favorito }) => {
                      const isNovo = !visto && createdAt?.toDate() > new Date(Date.now() - 24*60*60*1000);
                      return (
                        <div
                          key={id}
                          className={`p-4 md:p-6 transition-all duration-200 ${
                            !visto ? 'bg-blue-50/50' : 'bg-white'
                          } hover:bg-gray-50`}
                        >
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getTipoColor(tipo)}`}>
                                  {getTipoIcon(tipo)}
                                  {tipo?.toUpperCase() || "TIPO?"}
                                </span>
                                
                                <span className="text-xs text-gray-500">
                                  {createdAt?.toDate().toLocaleString('pt-BR') || "Sem data"}
                                </span>
                                
                                {isNovo && (
                                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Novo
                                  </span>
                                )}
                              </div>
                                <p className="text-gray-900 mb-3 whitespace-pre-line break-words leading-relaxed w-full">
                                 {mensagem}
                                 </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FaUsers className="text-gray-400" />
                                <span className="truncate">
                                  {userMap[userId] || userId}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                onClick={() => handleMarcarVisto(id, !visto)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  visto 
                                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={visto ? "Marcar como não lido" : "Marcar como lido"}
                              >
                                {visto ? <FaEye /> : <FaEyeSlash />}
                              </button>
                              
                              <button
                                onClick={() => handleFavoritar(id, !favorito)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  favorito 
                                    ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                              >
                                {favorito ? <FaStar /> : <FaRegStar />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbacks;
