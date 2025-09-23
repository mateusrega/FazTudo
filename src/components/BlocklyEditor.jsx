// src/components/BlocklyEditor.jsx
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import "blockly/javascript";

// === Definição de blocos customizados === //
Blockly.Blocks["voice_command"] = {
  init: function () {
    this.appendDummyInput().appendField("Quando ouvir comando de voz");
    this.setNextStatement(true, null);
    this.setColour(210);
    this.setTooltip("Inicia fluxo quando um comando de voz é detectado.");
  },
};

Blockly.Blocks["send_notification"] = {
  init: function () {
    this.appendDummyInput().appendField("Enviar notificação");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120);
    this.setTooltip("Envia uma notificação simples.");
  },
};

Blockly.Blocks["wait_seconds"] = {
  init: function () {
    this.appendValueInput("SECONDS")
      .setCheck("Number")
      .appendField("Esperar (segundos)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
    this.setTooltip("Pausa o fluxo por X segundos.");
  },
};

Blockly.Blocks["show_alert"] = {
  init: function () {
    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField("Mostrar alerta");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip("Mostra uma mensagem de alerta.");
  },
};

// === Geradores simples em JS (pode ser adaptado depois) === //
Blockly.JavaScript["voice_command"] = function () {
  return "// Evento: comando de voz detectado\n";
};
Blockly.JavaScript["send_notification"] = function () {
  return 'console.log("🔔 Notificação enviada!");\n';
};
Blockly.JavaScript["wait_seconds"] = function (block) {
  const seconds = Blockly.JavaScript.valueToCode(block, "SECONDS", Blockly.JavaScript.ORDER_ATOMIC) || 1;
  return `await new Promise(r => setTimeout(r, ${seconds} * 1000));\n`;
};
Blockly.JavaScript["show_alert"] = function (block) {
  const text = Blockly.JavaScript.valueToCode(block, "TEXT", Blockly.JavaScript.ORDER_ATOMIC) || '"Alerta!"';
  return `alert(${text});\n`;
};

// === Componente principal === //
export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const toolbox = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current || !toolbox.current) return;

    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 2,
        minScale: 0.3,
      },
      move: {
        scrollbars: true,
        drag: true,
        wheel: false,
        dragOptions: {
          snap: true,
          dragStartHysteresis: 0,
        },
      },
    });

    // Ajusta lixeira
    const trash = workspace.current.trashcan_;
    if (trash && trash.svgGroup_) {
      trash.svgGroup_.setAttribute("transform", "translate(0,-50) scale(0.33)");
    }

    const resizeObserver = new ResizeObserver(() => {
      if (workspace.current) Blockly.svgResize(workspace.current);
    });
    resizeObserver.observe(blocklyDiv.current);

    return () => {
      resizeObserver.disconnect();
      workspace.current?.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[600px] border rounded-xl bg-white shadow-md relative">
      {/* Área do editor */}
      <div ref={blocklyDiv} style={{ height: "100%", width: "100%" }} />

      {/* Toolbox com blocos disponíveis */}
      <xml xmlns="https://developers.google.com/blockly/xml" style={{ display: "none" }} ref={toolbox}>
        <category name="Eventos" colour="#FFAB19">
          <block type="voice_command"></block>
        </category>
        <category name="Ações" colour="#4CAF50">
          <block type="send_notification"></block>
          <block type="wait_seconds"></block>
          <block type="show_alert"></block>
        </category>
      </xml>
    </div>
  );
}
