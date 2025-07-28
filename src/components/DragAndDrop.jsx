import React, { useEffect, useRef, useState } from "react";
import { initBlockly } from "../blockly";
import { FaPlay, FaSave, FaDownload, FaCode } from "react-icons/fa";

export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blocklyDiv.current) {
      try {
        workspaceRef.current = initBlockly(blocklyDiv.current);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao inicializar Blockly:", error);
        setIsLoading(false);
      }
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  const handleSave = () => {
    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xml);
      localStorage.setItem('blockly-workspace', xmlText);
      alert('Automação salva com sucesso!');
    }
  };

  const handleRun = () => {
    alert('Executando automação... (funcionalidade em desenvolvimento)');
  };

  const handleExport = () => {
    if (workspaceRef.current) {
      const code = Blockly.JavaScript.workspaceToCode(workspaceRef.current);
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'automacao.js';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaCode className="text-yellow-300" />
            Editor Visual de Automações
          </h2>
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <FaPlay size={14} />
              Executar
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <FaSave size={14} />
              Salvar
            </button>
            <button
              onClick={handleExport}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
            >
              <FaDownload size={14} />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div 
          ref={blocklyDiv} 
          className="h-[600px] w-full"
          style={{ minHeight: '600px' }}
        />
        
        {/* Overlay de ajuda */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-lg text-sm max-w-xs">
          <p className="font-semibold mb-1">💡 Dica:</p>
          <p>Arraste os blocos da barra lateral para criar sua automação!</p>
        </div>
      </div>
    </div>
  );
}