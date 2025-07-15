// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">⚙️ Minhas Automações</h1>
        <p className="text-gray-600">Você ainda não criou nenhuma automação.</p>
      </main>
    </div>
  );
};

export default Dashboard;
