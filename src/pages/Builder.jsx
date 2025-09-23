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

  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
      horizontalLayout: false,
      zoom: { controls: true, wheel: true, startScale: 1, maxScale: 2, minScale: 0.3 },
      move: { scrollbars: true, drag: true, wheel: false },
    });

    // Ajusta a lixeira
    const trash = workspaceRef.current.trashcan_;
    if (trash && trash.svgGroup_) {
      trash.svgGroup_.setAttribute("transform", "translate(0,-40) scale(0.33)");
    }

    // Redimensionamento automático
    const resizeObserver = new ResizeObserver(() => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    });
    if (blocklyDiv.current) resizeObserver.observe(blocklyDiv.current);

    return () => {
      resizeObserver.disconnect();
      workspaceRef.current?.dispose();
    };
  }, []);

  const toggleFullscreen = () => {
    const container = document.getElementById("builder-container");
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
      else if (container.msRequestFullscreen) container.msRequestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      setIsFullscreen(false);
    }

    setTimeout(() => {
      if (workspaceRef.current) Blockly.svgResize(workspaceRef.current);
    }, 300);
  };

  return (
    <div id="builder-container" className="w-full h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Barra de ações */}
        <div className="p-2 flex gap-3 items-center bg-white shadow">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
          <FaRocket className="text-blue-500 text-xl" />
          <FaLightbulb className="text-yellow-500 text-xl" />
        </div>

        {/* Editor */}
        <div className="flex-1 p-2">
          <div
            ref={blocklyDiv}
            className="w-full h-full border rounded-xl bg-white shadow-md"
          />

          {/* Toolbox */}
          <xml
            xmlns="https://developers.google.com/blockly/xml"
            style={{ display: "none" }}
            ref={toolbox}
          >
            <category name="Eventos" colour="#FFAB19">
              <block type="controls_if"></block>
              <block type="controls_repeat_ext"></block>
            </category>
            <category name="Ações" colour="#4CAF50">
              <block type="text_print"></block>
              <block type="text"></block>
            </category>
            <category name="Lógica" colour="#3F51B5">
              <block type="logic_compare"></block>
              <block type="logic_operation"></block>
              <block type="logic_boolean"></block>
            </category>
            <category name="Números" colour="#795548">
              <block type="math_number"></block>
              <block type="math_arithmetic"></block>
            </category>
            <category name="Texto" colour="#9C27B0">
              <block type="text"></block>
              <block type="text_join"></block>
              <block type="text_length"></block>
            </category>
            <category name="Cor" colour="#A6745C">
              <block type="colour_picker"></block>
              <block type="colour_random"></block>
              <block type="colour_rgb">
                <value name="RED">
                  <shadow type="math_number"><field name="NUM">100</field></shadow>
                </value>
                <value name="GREEN">
                  <shadow type="math_number"><field name="NUM">50</field></shadow>
                </value>
                <value name="BLUE">
                  <shadow type="math_number"><field name="NUM">0</field></shadow>
                </value>
              </block>
            </category>
          </xml>
        </div>
      </div>

      <VoiceRecorder />
    </div>
  );
}
