import React, { useEffect, useRef, useState } from "react";
import Blockly from "blockly/core";
import "blockly/blocks"; // blocos padrões (if, lógica, texto, etc)
import "blockly/javascript"; // gerador JS básico
import { FaCode } from "react-icons/fa";

import { toolbox } from "./toolbox";

// Importar seus blocos personalizados e geradores
import "./blocks/webhook_trigger";
import "./generators/javascript/webhook_trigger_generator";
// Importe os outros blocos e geradores da mesma forma

function initBlockly(div) {
  return Blockly.inject(div, {
    toolbox: toolbox,
    trashcan: true,
    theme: Blockly.Themes.Classic,
  });
}

export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (blocklyDiv.current) {
      workspaceRef.current = initBlockly(blocklyDiv.current);
      setIsLoading(false);
    }

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  const handleSave = () => {
    if (!workspaceRef.current) return;
    const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
    const xmlText = Blockly.Xml.domToText(xml);
    if (!xmlText || xmlText.includes('<xml xmlns="https://developers.google.com/blockly/xml"></xml>')) {
      alert("Workspace vazio! Adicione blocos antes de salvar.");
      return;
    }
    localStorage.setItem("blockly-workspace", xmlText);
    alert("Automação salva!");
  };

  const handleLoad = () => {
    if (!workspaceRef.current) return;
    const savedXml = localStorage.getItem("blockly-workspace");
    if (!savedXml) {
      alert("Nenhuma automação salva encontrada.");
      return;
    }
    const xml = Blockly.Xml.textToDom(savedXml);
    Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
    alert("Automação carregada!");
  };

  const handleExport = () => {
    if (!workspaceRef.current) return;

    const code = Blockly.JavaScript.workspaceToCode(workspaceRef.current);

    if (!code.trim()) {
      alert("Nenhum código para exportar.");
      return;
    }
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "automacao.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm("Tem certeza que deseja limpar o workspace?")) {
      workspaceRef.current?.clear();
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
            <button onClick={handleLoad} className="btn-indigo">Carregar</button>
            <button onClick={handleSave} className="btn-blue">Salvar</button>
            <button onClick={handleExport} className="btn-purple">Exportar</button>
            <button onClick={handleClear} className="btn-red">Limpar</button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={blocklyDiv}
        className="h-[600px] w-full"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
