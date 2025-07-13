import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);
  const [automations, setAutomations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchAutomations = async () => {
      const querySnapshot = await getDocs(collection(db, "users", user.uid, "automations"));
      const data = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));
      setAutomations(data);
    };
    fetchAutomations();
  }, [user]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Usuário não autenticado</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-6">Minhas Automações</h1>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate("/builder/new")}
      >
        + Nova automação
      </button>

      {automations.length === 0 && <p>Você ainda não criou nenhuma automação.</p>}

      <ul>
        {automations.map(({ id, name }) => (
          <li
            key={id}
            className="border p-4 mb-2 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/builder/${id}`)}
          >
            {name}
          </li>
        ))}
      </ul>

      <button
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        onClick={() => navigate("/feedback")}
      >
        Enviar Feedback
      </button>
    </div>
  );
};

export default Dashboard;
