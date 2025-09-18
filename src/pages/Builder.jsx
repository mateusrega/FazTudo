// src/pages/Builder.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import VoiceRecorder from "../components/VoiceRecorder"; // 🎙️ continua
import { FaLightbulb, FaRocket } from "react-icons/fa";

export default function Builder() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex-1 lg:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 pt-16 lg:pt-0">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl flex-shrink-0">
              <FaRocket className="text-white text-xl" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
              Criador de Automações
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-lg">
            Aqui você poderá criar automações. 🚀
          </p>
        </div>

        {/* Gravador de voz */}
        <div className="mt-6">
          <VoiceRecorder
            onResult={(texto) => {
              console.log("Comando de voz:", texto);
              // 👉 aqui no futuro você interpreta e transforma em blocos ou fluxos
            }}
          />
        </div>

        {/* Dicas */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 mt-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-2 rounded-xl flex-shrink-0">
              <FaLightbulb className="text-yellow-600 text-lg md:text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                Como usar o Builder:
              </h3>
              <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                <li>• <strong>Voz:</strong> Grave comandos para configurar automações</li>
                <li>• <strong>Fluxos:</strong> Em breve será possível montar fluxos visuais</li>
                <li>• <strong>Dicas:</strong> Experimente gravar frases como <em>"quando receber mensagem, salvar no banco"</em></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
