import React, { useContext } from "react";
import { FaHome, FaCogs, FaEnvelope, FaUserShield, FaRocket, FaSignOutAlt } from "react-icons/fa";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Sidebar() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const modoTeste = localStorage.getItem("modoTeste") === "true";

  const isAdmin = user && user.email === "admin@exemplo.com";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard", color: "text-blue-400" },
    { path: "/builder", icon: FaCogs, label: "Builder", color: "text-green-400" },
    { path: "/feedback", icon: FaEnvelope, label: "Feedback", color: "text-purple-400" },
  ];

  if (!modoTeste && isAdmin) {
    menuItems.push({ path: "/admin", icon: FaUserShield, label: "Admin", color: "text-red-400" });
  }

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-700">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
          <FaRocket className="text-2xl text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            FazTudo
          </h1>
          <p className="text-xs text-gray-400">Automação Pessoal</p>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map(({ path, icon: Icon, label, color }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <button
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'hover:bg-gray-700 text-gray-300 hover:text-white hover:transform hover:scale-105'
                  }`}
                >
                  <Icon className={`text-lg ${isActive ? 'text-white' : color}`} />
                  <span className="font-medium">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 hover:transform hover:scale-105"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}