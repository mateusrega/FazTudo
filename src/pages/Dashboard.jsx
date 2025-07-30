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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="lg:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 pt-16 lg:pt-0">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.displayName || user?.email?.split('@')?.[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Gerencie suas automações e acompanhe o desempenho
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map(({ icon: Icon, label, value, color }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium">{label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`bg-gradient-to-r ${color} p-2 md:p-3 rounded-xl`}>
                  <Icon className="text-white text-lg md:text-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Automações Recentes */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Suas Automações</h2>
              <button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
              >
                <FaPlus />
                Nova Automação
              </button>
            </div>

            {/* Empty State */}
            <div className="text-center py-8 md:py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-2xl md:text-4xl text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Nenhuma automação criada ainda
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-6 px-4">
                Comece criando sua primeira automação para economizar tempo!
              </p>
              <button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
              >
                Criar Primeira Automação
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Ações Rápidas</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate("/builder")}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-3 md:p-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 text-sm md:text-base"
              >
                <FaPlus />
                <span>Criar Automação</span>
              </button>
              
              <button
                onClick={() => navigate("/feedback")}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 md:p-4 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 text-sm md:text-base"
              >
                <FaChartLine />
                <span>Enviar Feedback</span>
              </button>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 md:p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">💡 Dica do Dia</h4>
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
