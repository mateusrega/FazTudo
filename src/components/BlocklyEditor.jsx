// src/components/BlocklyEditor.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks"; // blocos padrões
import "blockly/javascript"; // gerador JS (mesmo sem exportar, precisa pra rodar)

export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    // Inicializa o editor
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
      scrollbars: true,
    });

    return () => {
      workspace.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[600px] border rounded-xl bg-white shadow-md">
      {/* Área do editor */}
      <div ref={blocklyDiv} style={{ height: "100%", width: "100%" }} />

      {/* Toolbox com blocos disponíveis */}
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
          <block type="math_number"></block>
        </category>
        <category name="Lógica" colour="#3F51B5">
          <block type="logic_compare"></block>
          <block type="logic_operation"></block>
          <block type="logic_boolean"></block>
        </category>
      </xml>
    </div>
  );
}
