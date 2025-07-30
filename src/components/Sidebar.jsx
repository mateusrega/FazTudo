import { FaBars, FaTimes, FaRocket, FaChevronLeft } from "react-icons/fa";
import { useState } from "react";

export default function Sidebar() {
  const [sidebarAberta, setSidebarAberta] = useState(true);

  return (
    <>
      {/* Sidebar principal */}
      <aside className={`bg-gray-900 text-white h-full fixed top-0 left-0 z-40 transition-all duration-300 ${sidebarAberta ? "w-64" : "w-16"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <button onClick={() => setSidebarAberta(!sidebarAberta)} className="text-white text-xl">
            {/* Mobile: mostrar X se aberta */}
            {sidebarAberta && <FaTimes className="lg:hidden" />}
            {/* Desktop: mostrar seta ou ícone de menu */}
            <span className="hidden lg:inline">
              {sidebarAberta ? <FaChevronLeft /> : <FaBars />}
            </span>
          </button>

          {/* Logo e título se sidebar estiver aberta */}
          {sidebarAberta && (
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <FaRocket className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FazTudo
                </h1>
                <p className="text-xs text-gray-400">Automação</p>
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo da Sidebar aqui... */}
      </aside>

      {/* Botão flutuante para abrir a sidebar no mobile */}
      {!sidebarAberta && (
        <button
          onClick={() => setSidebarAberta(true)}
          className="lg:hidden fixed top-4 left-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50"
        >
          <FaBars />
        </button>
      )}
    </>
  );
}
