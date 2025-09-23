// src/components/Builder.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import "blockly/blocks"; // blocos padrões
import "blockly/javascript"; // gerador JS

const Builder = () => {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    // Inicializa Blockly
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
      scrollbars: true,
      renderer: "zelos",
      move: {
        scrollbars: true,
        drag: true,
        wheel: true,
      },
    });

    return () => {
      workspace.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Área do editor */}
      <div className="flex-1 p-2">
        <div
          ref={blocklyDiv}
          className="w-full h-full border rounded-xl bg-white shadow-md"
        />

        {/* Toolbox com blocos simples */}
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
                <shadow type="math_number">
                  <field name="NUM">100</field>
                </shadow>
              </value>
              <value name="GREEN">
                <shadow type="math_number">
                  <field name="NUM">50</field>
                </shadow>
              </value>
              <value name="BLUE">
                <shadow type="math_number">
                  <field name="NUM">0</field>
                </shadow>
              </value>
            </block>
          </category>
        </xml>
      </div>
    </div>
  );
};

export default Builder;
