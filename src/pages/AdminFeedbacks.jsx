import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import { collection, getDocs, orderBy, query, updateDoc, doc } from "firebase/firestore";
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
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeedbacks(data);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [user, navigate]);

  const toggleFavorite = async (id, isFavorite) => {
    await updateDoc(doc(db, "feedbacks", id), { favorite: !isFavorite });
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, favorite: !isFavorite } : f));
  };

  const toggleSeen = async (id, isSeen) => {
    await updateDoc(doc(db, "feedbacks", id), { seen: !isSeen });
    setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, seen: !isSeen } : f));
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === "Todos") return !f.seen;
    if (filter === "Vistos") return f.seen;
    if (filter === "Favoritos") return f.favorite && !f.seen;
    return f.category === filter && !f.seen;
  });

  return (
    <div className="admin-feedbacks">
      <Sidebar />
      <div className="content">
        <h1>Painel de Feedbacks</h1>

        <div className="stats">
          <p>Total de Usuários: {new Set(feedbacks.map(f => f.userEmail)).size}</p>
          <p>Total Feedbacks: {feedbacks.length}</p>
          <p>Não Lidos: {feedbacks.filter(f => !f.seen).length}</p>
          <p>Favoritos: {feedbacks.filter(f => f.favorite && !f.seen).length}</p>
        </div>

        <div className="filters">
          <button onClick={() => setFilter("Todos")}>Todos</button>
          <button onClick={() => setFilter("Vistos")}>Vistos</button>
          <button onClick={() => setFilter("Favoritos")}>Favoritos</button>
          <div className="category-filters">
            <button onClick={() => setFilter("Elogio")}>Elogio</button>
            <button onClick={() => setFilter("Sugestão")}>Sugestão</button>
            <button onClick={() => setFilter("Bug")}>Bug</button>
          </div>
        </div>

        <div className="feedback-list">
          {filteredFeedbacks.length === 0 ? (
            <p>Nenhum feedback encontrado</p>
          ) : (
            filteredFeedbacks.map(f => (
              <div key={f.id} className="feedback-item">
                <p><strong>{f.userEmail}</strong> ({f.category})</p>
                <p>{f.message}</p>
                <p>{new Date(f.createdAt?.seconds * 1000).toLocaleString()}</p>
                <button onClick={() => toggleFavorite(f.id, f.favorite)}>
                  {f.favorite ? <FaStar /> : <FaRegStar />}
                </button>
                <button onClick={() => toggleSeen(f.id, f.seen)}>
                  {f.seen ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbacks;
