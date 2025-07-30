import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import { UserContext } from "../contexts/UserContext";
import { FaPlus, FaRocket, FaChartLine, FaClock, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const stats = [
    { icon: FaRocket, label: "Automações Ativas", value: "0", color: "from-blue-500 to-blue-600" },
    { icon: FaPlay, label: "Execuções Hoje", value: "0", color: "from-green-500 to-green-600" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:ml-64 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.displayName || user?.email?.split('@')?.[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie suas automações e acompanhe o desempenho
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value, color }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`bg-gradient-to-r ${color} p-3 rounded-xl`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Automações Recentes */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Suas Automações</h2>
              <button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <FaPlus />
                Nova Automação
              </button>
            </div>

            {/* Empty State */}
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma automação criada ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Comece criando sua primeira automação para economizar tempo!
              </p>
              <button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Criar Primeira Automação
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/builder")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
              >
                <FaPlus />
                <span>Criar Automação</span>
              </button>
              
              <button
                onClick={() => navigate("/feedback")}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-3"
              >
                <FaChartLine />
                <span>Enviar Feedback</span>
              </button>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Dica do Dia</h4>
                <p className="text-sm text-gray-600">
                  Use o builder visual para criar automações complexas sem programar!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
