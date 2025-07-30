// src/pages/AdminFeedbacks.jsx
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
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
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64 p-4 md:p-6 max-w-4xl">
        <div className="pt-16 lg:pt-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Feedbacks Recebidos</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
        👥 Total de usuários registrados: <strong>{userCount}</strong>
      </p>
        </div>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum feedback enviado ainda.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map(({ id, userId, mensagem, tipo, createdAt }) => (
            <li
              key={id}
              className="border p-4 md:p-6 rounded-xl shadow bg-white hover:shadow-md transition-all"
            >
              <p className="text-xs md:text-sm text-gray-400">
                {createdAt?.toDate().toLocaleString() || "Sem data"}
              </p>
              <p className="font-semibold text-sm md:text-base">{tipo.toUpperCase()}</p>
              <p className="mt-2 text-sm md:text-base">{mensagem}</p>
              <p className="text-xs md:text-sm text-gray-500 mt-2 truncate">Usuário: {userId}</p>
            </li>
          ))}
        </ul>
      )}
      </div>
    </div>
  );
};

export default AdminFeedbacks;
