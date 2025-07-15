// src/pages/AdminFeedbacks.jsx
import React, { useEffect, useState, useContext } from "react";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  getCountFromServer,
} from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const AdminFeedbacks = () => {
  const { user } = useContext(UserContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();
  const ADMIN_UID = import.meta.env.VITE_ADMIN_UID;

  useEffect(() => {
    if (!user) return;
    if (user.uid !== ADMIN_UID) {
      alert("Acesso restrito.");
      navigate("/dashboard");
      return;
    }

    const fetchFeedbacks = async () => {
      const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(data);
    };

    const fetchUserCount = async () => {
      const snapshot = await getCountFromServer(collection(db, "users"));
      setUserCount(snapshot.data().count);
    };

    fetchFeedbacks();
    fetchUserCount();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">📋 Feedbacks Recebidos</h1>
      <p className="text-gray-600 mb-6">
        👥 Total de usuários registrados: <strong>{userCount}</strong>
      </p>

      {feedbacks.length === 0 ? (
        <p>Nenhum feedback enviado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map(({ id, userId, mensagem, tipo, createdAt }) => (
            <li
              key={id}
              className="border p-4 rounded-xl shadow bg-white hover:shadow-md transition-all"
            >
              <p className="text-sm text-gray-400">
                {createdAt?.toDate().toLocaleString() || "Sem data"}
              </p>
              <p className="font-semibold">{tipo.toUpperCase()}</p>
              <p className="mt-2">{mensagem}</p>
              <p className="text-sm text-gray-500 mt-2">Usuário: {userId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminFeedbacks;
