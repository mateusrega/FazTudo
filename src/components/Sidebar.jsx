import React, { useContext } from "react";
import { FaHome, FaCogs, FaEnvelope, FaUserShield, FaRocket } from "react-icons/fa";
import { UserContext } from "../contexts/UserContext";

export default function Sidebar() {
  const { user } = useContext(UserContext);
  const modoTeste = localStorage.getItem("modoTeste") === "true";

  const isAdmin = user && user.email === "admin@exemplo.com"; // ou seu critério de admin

  return (
    <aside className="w-64 h-screen bg-blue-900 text-white flex flex-col">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-blue-700">
        <FaRocket className="text-3xl text-yellow-400" />
        <h1 className="text-2xl font-bold select-none">FazTudo</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-4">
          <li>
            <a href="/" className="flex items-center gap-3 hover:text-yellow-400">
              <FaHome /> Início
            </a>
          </li>
          <li>
            <a href="/builder" className="flex items-center gap-3 hover:text-yellow-400">
              <FaCogs /> Builder
            </a>
          </li>
          <li>
            <a href="/feedback" className="flex items-center gap-3 hover:text-yellow-400">
              <FaEnvelope /> Feedback
            </a>
          </li>

          {/* Admin só aparece se não estiver em modo de teste */}
          {!modoTeste && isAdmin && (
            <li>
              <a href="/admin" className="flex items-center gap-3 hover:text-yellow-400">
                <FaUserShield /> Admin
              </a>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
