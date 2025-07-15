// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        ⚙️ Minhas Automações
      </h1>
      {/* Lista fictícia de automações */}
      <ul className="space-y-4">
        <li className="border p-4 rounded-xl shadow hover:shadow-lg transition-all bg-white">
          Exemplo de automação 1
        </li>
        <li className="border p-4 rounded-xl shadow hover:shadow-lg transition-all bg-white">
          Exemplo de automação 2
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
