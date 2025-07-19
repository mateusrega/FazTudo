import React, { useEffect, useRef } from "react";
import Blockly from "blockly";
import "blockly/javascript";

export default function BlocklyEditor() {
  const blocklyDiv = useRef(null);
  const workspaceRef = useRef(null);

  useEffect(() => {
    Blockly.defineBlocksWithJsonArray([
      {
        type: "whatsapp_message",
        message0: "Enviar mensagem WhatsApp: %1",
        args0: [
          {
            type: "input_value",
            name: "MESSAGE"
          }
        ],
        previousStatement: null,
        nextStatement: null,
        colour: 120,
        tooltip: "Envia mensagem no WhatsApp",
        helpUrl: ""
      },
      {
        type: "webhook_trigger",
        message0: "Gatilho Webhook %1",
        args0: [
          {
            type: "input_dummy"
          }
        ],
        nextStatement: null,
        colour: 290,
        tooltip: "Gatilho via Webhook",
        helpUrl: ""
      }
    ]);

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: `
        <xml>
          <block type="webhook_trigger"></block>
          <block type="whatsapp_message"></block>
          <block type="text"></block>
          <block type="math_number"></block>
          <block type="text_print"></block>
        </xml>
      `
    });

    return () => {
      workspaceRef.current.dispose();
    };
  }, []);

  return (
    <div className="h-[500px] w-full bg-white rounded shadow p-2">
      <div ref={blocklyDiv} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
