import React from "react";
import DragAndDrop from "../components/DragAndDrop";
import Sidebar from "../components/Sidebar";
import { FaLightbulb, FaRocket } from "react-icons/fa";

export default function Builder() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <FaRocket className="text-white text-xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Criador de Automações
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Use o editor visual para criar automações poderosas sem programar
          </p>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-100 p-2 rounded-xl">
              <FaLightbulb className="text-yellow-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Como usar o Builder:</h3>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• <strong>Gatilhos:</strong> Escolha o que inicia sua automação (webhook, botão, etc.)</li>
                <li>• <strong>Ações:</strong> Defina o que acontece (enviar mensagem, salvar dados, etc.)</li>
                <li>• <strong>Lógica:</strong> Adicione condições e decisões</li>
                <li>• <strong>Conecte os blocos:</strong> Arraste e solte para criar o fluxo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Editor */}
        <DragAndDrop />
      </div>
    </div>
  );
}