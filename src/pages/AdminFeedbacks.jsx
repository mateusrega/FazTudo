import React, { useEffect, useState, useContext } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  // UID seguro via variável de ambiente (.env)
  const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

  useEffect(() => {
    if (!user) return;

    if (user.uid !== ADMIN_UID) {
      alert("Acesso restrito a administradores.");
      navigate("/dashboard");
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeedbacks(data);
      } catch (error) {
        console.error("Erro ao buscar feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">📋 Painel de Feedbacks</h1>

      {feedbacks.length === 0 ? (
        <p>Nenhum feedback enviado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map(({ id, userId, mensagem, tipo, createdAt }) => (
            <li key={id} className="border p-4 rounded shadow bg-white">
              <p><strong>Tipo:</strong> {tipo}</p>
              <p><strong>Mensagem:</strong> {mensagem}</p>
              <p><strong>Usuário:</strong> {userId}</p>
              <p><strong>Data:</strong> {createdAt?.toDate().toLocaleString() || "Sem data"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFeedbacks;
