import React from "react";
import BlocklyEditor from "../blockly/BlocklyEditor"; // importa seu editor Blockly real
import Sidebar from "../components/Sidebar";
import VoiceRecorder from "../components/VoiceRecorder"; // 🎙️ novo componente
import { FaLightbulb, FaRocket } from "react-icons/fa";

export default function Builder() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
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
            Use o editor visual para criar automações poderosas sem programar
          </p>
        </div>

        {/* Editor */}
        <BlocklyEditor />

        {/* Voice Recorder */}
        <div className="mt-6">
          <VoiceRecorder
            onResult={(texto) => {
              console.log("Comando de voz:", texto);
              // Aqui você pode interpretar comandos de voz no futuro
            }}
          />
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-4 md:p-6 mb-6 md:mb-8 mt-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-2 rounded-xl flex-shrink-0">
              <FaLightbulb className="text-yellow-600 text-lg md:text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">Como usar o Builder:</h3>
              <ul className="text-gray-700 space-y-1 text-xs md:text-sm">
                <li>• <strong>Gatilhos:</strong> Escolha o que inicia sua automação (webhook, botão, etc.)</li>
                <li>• <strong>Ações:</strong> Defina o que acontece (enviar mensagem, salvar dados, etc.)</li>
                <li>• <strong>Lógica:</strong> Adicione condições e decisões</li>
                <li>• <strong>Conecte os blocos:</strong> Arraste e solte para criar o fluxo</li>
              </ul>
              <strong><a href: "animacao.html">animação</a></strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
