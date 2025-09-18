// src/pages/Builder.jsx
import React, { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import VoiceRecorder from "../components/VoiceRecorder"; // 🎙️ continua
import { FaLightbulb, FaRocket } from "react-icons/fa";
import * as Blockly from "blockly/core";
import "blockly/blocks"; // blocos padrão
import "blockly/javascript"; // gerador de código (não vamos usar agora)

export default function Builder() {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    // Inicializa o Blockly
    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
      scrollbars: true,
    });

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
      }
    };
  }, []);

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
            Monte fluxos de automação arrastando blocos. 🚀
          </p>
        </div>

        {/* Editor de blocos */}
        <div className="border rounded-xl bg-white shadow p-2 md:p-4">
          <div
            ref={blocklyDiv}
            style={{ height: "500px", width: "100%" }}
          ></div>
          {/* Definição da toolbox */}
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
        </div>

        {/* Gravador de voz */}
        <div className="mt-6">
          <VoiceRecorder
            onResult={(texto) => {
              console.log("Comando de voz:", texto);
              // 👉 no futuro: transformar texto em blocos
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
