import Blockly from "blockly";

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
