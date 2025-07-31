import Blockly from "blockly";

// Definir blocos customizados de forma mais segura
try {
  Blockly.defineBlocksWithJsonArray([
    {
      type: "webhook_trigger",
      message0: "Quando receber Webhook",
      nextStatement: null,
      style: "gatilhos",
      tooltip: "Dispara ao receber um Webhook"
    },
    {
      type: "whatsapp_message",
      message0: "Enviar mensagem no WhatsApp",
      previousStatement: null,
      nextStatement: null,
      style: "acoes",
      tooltip: "Envia uma mensagem"
    },
    {
      type: "save_google_sheets",
      message0: "Salvar no Google Sheets",
      previousStatement: null,
      nextStatement: null,
      style: "acoes",
      tooltip: "Salva dados no Sheets"
    },
    {
      type: "telegram_notification",
      message0: "Notificar no Telegram",
      previousStatement: null,
      nextStatement: null,
      style: "acoes",
      tooltip: "Envia no Telegram"
    },
    {
      type: "auto_reply",
      message0: "Enviar resposta automática",
      previousStatement: null,
      nextStatement: null,
      style: "acoes",
      tooltip: "Responde automaticamente"
    }
  ]);
} catch (error) {
  console.error("Erro ao definir blocos customizados:", error);
}

// Definir geradores de código para os blocos customizados
try {
  const javascriptGenerator = Blockly.JavaScript || (Blockly.generators && Blockly.generators.JavaScript);
  
  if (javascriptGenerator) {
    javascriptGenerator['webhook_trigger'] = function(block) {
      return 'console.log("Webhook recebido");\n';
    };
    
    javascriptGenerator['whatsapp_message'] = function(block) {
      return 'console.log("Enviando mensagem WhatsApp");\n';
    };
    
    javascriptGenerator['save_google_sheets'] = function(block) {
      return 'console.log("Salvando no Google Sheets");\n';
    };
    
    javascriptGenerator['telegram_notification'] = function(block) {
      return 'console.log("Enviando notificação Telegram");\n';
    };
    
    javascriptGenerator['auto_reply'] = function(block) {
      return 'console.log("Enviando resposta automática");\n';
    };
  }
} catch (error) {
  console.error("Erro ao definir geradores de código:", error);
}