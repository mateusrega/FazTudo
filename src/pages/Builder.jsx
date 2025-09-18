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
      horizontalLayout: false, // 🔥 mantém as categorias estáveis
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 2,
        minScale: 0.3,
      },
    });

    // Ajusta ao redimensionar a janela
    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

  // Sempre que ativar/desativar fullscreen → forçar resize
  useEffect(() => {
    if (workspaceRef.current) {
      setTimeout(() => {
        Blockly.svgResize(workspaceRef.current);
      }, 100); // pequeno delay pra garantir que o layout aplicou
    }
  }, [isFullscreen]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 lg:ml-64 p-4 md:p-8">
        {/* Header */}
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
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl shadow hover:opacity-90 transition"
          >
            {isFullscreen ? (
              <>
                <FaCompress /> Sair da Tela Cheia
              </>
            ) : (
              <>
                <FaExpand /> Tela Cheia
              </>
            )}
          </button>
        </div>

        {/* Editor */}
        <div
          className={`relative border rounded-2xl bg-white shadow-lg overflow-hidden transition-all ${
            isFullscreen
              ? "fixed inset-0 z-50 m-0 rounded-none"
              : "p-2 md:p-4"
          }`}
        >
          <div
            ref={blocklyDiv}
            style={{ height: isFullscreen ? "100%" : "500px", width: "100%" }}
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

          {/* Botão dentro do fullscreen */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 hover:bg-red-600 transition"
            >
              <FaCompress /> Fechar
            </button>
          )}
        </div>

        {/* Gravador de voz */}
        <div className="mt-6">
          <VoiceRecorder
            onResult={(texto) => {
              console.log("Comando de voz:", texto);
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
                <li>• Arraste blocos da caixa lateral para a área branca</li>
                <li>• Encaixe blocos de lógica, loops, matemática e texto</li>
                <li>• Clique em "Tela Cheia" para expandir o editor</li>
                <li>• Use a lixeira para remover blocos</li>
                <li>• Em breve: integração com comandos de voz 🎙️</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
        }
