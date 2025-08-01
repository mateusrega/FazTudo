import Blockly from "blockly";

const jsGenerator = Blockly.JavaScript;

jsGenerator['whatsapp_message'] = function(block) {
  return 'console.log("Enviando mensagem WhatsApp");\n';
};

jsGenerator['save_google_sheets'] = function(block) {
  return 'console.log("Salvando no Google Sheets");\n';
};

jsGenerator['telegram_notification'] = function(block) {
  return 'console.log("Enviando notificação Telegram");\n';
};

jsGenerator['auto_reply'] = function(block) {
  return 'console.log("Enviando resposta automática");\n';
};
