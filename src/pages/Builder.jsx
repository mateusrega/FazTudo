// src/pages/Builder.jsx
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import VoiceRecorder from "../components/VoiceRecorder";
import { FaLightbulb, FaRocket, FaExpand, FaCompress } from "react-icons/fa";
import * as Blockly from "blockly/core";
import "blockly/blocks";
import "blockly/javascript";

export default function Builder() {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Inicializa o Blockly
  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
      horizontalLayout: false,
      zoom: { controls: true, wheel: true, startScale: 1, maxScale: 2, minScale: 0.3 },
      move: {
        scrollbars: true,
        drag: true,
        wheel: false,
        dragOptions: {
          snap: true,               // encaixe instantâneo
          dragStartHysteresis: 0,   // arraste instantâneo no touch
        },
      },
    });

    // Redimensionamento automático
    const resizeObserver = new ResizeObserver(() => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    });
    resizeObserver.observe(blocklyDiv.current);

    return () => {
      resizeObserver.disconnect();
      if (workspaceRef.current) workspaceRef.current.dispose();
    };
  }, []);

  // Ajusta Blockly ao alternar fullscreen
  useEffect(() => {
    if (workspaceRef.current) {
      setTimeout(() => Blockly.svgResize(workspaceRef.current), 100);
    }
  }, [isFullscreen]);

  // Função de comando de voz para criar blocos
  const handleVoiceCommand = (text) => {
    if (!workspaceRef.current) return;
    const cmd = text.toLowerCase();

    if (cmd.includes("loop")) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom('<block type="controls_repeat_ext"></block>'),
        workspaceRef.current
      );
    } else if (cmd.includes("se")) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom('<block type="controls_if"></block>'),
        workspaceRef.current
      );
    } else if (cmd.includes("imprimir")) {
      Blockly.Xml.domToWorkspace(
        Blockly.Xml.textToDom('<block type="text_print"></block>'),
        workspaceRef.current
      );
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex ${isFullscreen ? "overflow-hidden" : ""}`}>
      {!isFullscreen && <Sidebar />}

      <div className={`flex-1 ${isFullscreen ? "p-0" : "lg:ml-64 p-4 md:p-8"}`}>
        {/* Header */}
        {!isFullscreen && (
          <div className="mb-6 md:mb-8 pt-16 lg:pt-0 flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                  Criador de Automações
                </h1>
              </div>
              <p className="text-gray-600 text-sm md:text-lg">
                Monte fluxos de automação arrastando blocos. 🚀
              </p>
            </div>

            {/* Botão de tela cheia */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow hover:opacity-90 transition"
            >
              <FaExpand /> Tela Cheia
            </button>
          </div>
        )}

        {/* Editor */}
        <div
          className={`relative bg-white shadow-lg transition-all ${
            isFullscreen ? "fixed inset-0 z-50" : "border rounded-2xl p-2 md:p-4"
          }`}
        >
          <div
            ref={blocklyDiv}
            style={{
              height: isFullscreen ? "100vh" : "500px",
              width: "100%",
              minHeight: "300px",
              transition: "height 0.3s ease",
            }}
          />

          {/* Toolbox */}
          <xml
            xmlns="https://developers.google.com/blockly/xml"
            style={{ display: "none" }}
            ref={toolbox}
          >
            <category name="Lógica" colour="210">
              <block type="controls_if"></block>
              <block type="logic_compare"></block>
              <block type="logic_operation"></block>
              <block type="logic_boolean"></block>
            </category>
            <category name="Loops" colour="120">
              <block type="controls_repeat_ext"></block>
              <block type="controls_whileUntil"></block>
            </category>
            <category name="Texto" colour="160">
              <block type="text"></block>
              <block type="text_print"></block>
            </category>
            <category name="Matemática" colour="230">
              <block type="math_number"></block>
              <block type="math_arithmetic"></block>
            </category>
          </xml>

          {/* Botão fechar fullscreen */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-red-600 transition"
            >
              <FaCompress /> Fechar
            </button>
          )}
        </div>

        {/* Botão gerar código */}
        <button
          onClick={() => {
            if (workspaceRef.current) {
              const code = Blockly.JavaScript.workspaceToCode(workspaceRef.current);
              console.log("Código gerado:", code);
              alert("Código gerado no console!");
            }
          }}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:opacity-90 transition"
        >
          Gerar Código
        </button>

        {/* Gravador de voz */}
        <div className="mt-6">
          <VoiceRecorder onResult={handleVoiceCommand} />
        </div>

        {/* Dicas */}
        {!isFullscreen && (
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
                  <li>• Arraste blocos da caixa lateral para a área branca</li>
                  <li>• Encaixe blocos de lógica, loops, matemática e texto</li>
                  <li>• Clique em "Tela Cheia" para expandir o editor</li>
                  <li>• Use a lixeira para remover blocos</li>
                  <li>• Em breve: integração com comandos de voz 🎙️</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
          }
