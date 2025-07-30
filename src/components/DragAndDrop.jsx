import React, { useEffect, useRef, useState } from "react";
import Blockly from "blockly";
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
      try {
        const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
        const xmlText = Blockly.Xml.domToText(xml);

        if (
          !xmlText ||
          xmlText.includes(
            '<xml xmlns="https://developers.google.com/blockly/xml"></xml>'
          )
        ) {
          alert("Workspace vazio! Adicione alguns blocos antes de salvar.");
          return;
        }

        localStorage.setItem("blockly-workspace", xmlText);
        alert("Automação salva com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Erro ao salvar automação.");
      }
    }
  };

  const handleRun = () => {
    alert("Executando automação... (funcionalidade em desenvolvimento)");
  };

  const handleExport = () => {
    if (workspaceRef.current) {
      try {
        const code = Blockly.JavaScript.workspaceToCode(workspaceRef.current);
        if (!code.trim()) {
          alert("Nenhum código para exportar. Adicione alguns blocos primeiro!");
          return;
        }

        const blob = new Blob([code], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "automacao.js";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao exportar:", error);
        alert("Erro ao exportar código. Verifique se há blocos válidos no workspace.");
      }
    }
  };

  const handleLoad = () => {
    if (workspaceRef.current) {
      try {
        const savedXml = localStorage.getItem("blockly-workspace");
        if (savedXml) {
          const xml = Blockly.Xml.textToDom(savedXml);
          Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
          alert("Automação carregada com sucesso!");
        } else {
          alert("Nenhuma automação salva encontrada.");
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
        alert("Erro ao carregar automação salva.");
      }
    }
  };

  const handleClear = () => {
    if (
      workspaceRef.current &&
      window.confirm("Tem certeza que deseja limpar o workspace?")
    ) {
      workspaceRef.current.clear();
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
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <FaCode className="text-yellow-300" />
            Editor Visual de Automações
          </h2>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleLoad}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 transform hover:scale-105 text-xs md:text-sm"
            >
              <FaDownload size={14} />
              <span className="hidden sm:inline">Carregar</span>
            </button>
            <button
              onClick={handleRun}
              className="bg-green-500 hover:bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 transform hover:scale-105 text-xs md:text-sm"
            >
              <FaPlay size={14} />
              <span className="hidden sm:inline">Executar</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 transform hover:scale-105 text-xs md:text-sm"
            >
              <FaSave size={14} />
              <span className="hidden sm:inline">Salvar</span>
            </button>
            <button
              onClick={handleExport}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 transform hover:scale-105 text-xs md:text-sm"
            >
              <FaDownload size={14} />
              <span className="hidden sm:inline">Exportar</span>
            </button>
            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 transition-all duration-200 transform hover:scale-105 text-xs md:text-sm"
            >
              🗑️ <span className="hidden sm:inline">Limpar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={blocklyDiv}
          className="h-[400px] md:h-[600px] w-full"
          style={{ minHeight: "400px" }}
        />

        {/* Overlay de ajuda */}
        <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black bg-opacity-70 text-white p-2 md:p-3 rounded-lg text-xs md:text-sm max-w-xs hidden md:block">
          <p className="font-semibold mb-1 text-xs md:text-sm">💡 Dica:</p>
          <p className="text-xs md:text-sm">Arraste os blocos da barra lateral para criar sua automação!</p>
        </div>
      </div>
    </div>
  );
}
