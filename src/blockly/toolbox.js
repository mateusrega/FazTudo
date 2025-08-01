// src/blockly/toolbox.js

export const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "🔥 Gatilhos",
      "categorystyle": "gatilhos_category",
      "contents": [
        { "kind": "block", "type": "webhook_trigger" }
      ]
    },
    {
      "kind": "category",
      "name": "⚡ Ações",
      "categorystyle": "acoes_category",
      "contents": [
        { "kind": "block", "type": "whatsapp_message" },
        { "kind": "block", "type": "save_google_sheets" },
        { "kind": "block", "type": "telegram_notification" },
        { "kind": "block", "type": "auto_reply" }
      ]
    },
    {
      "kind": "category",
      "name": "🧠 Lógica",
      "categorystyle": "logica_category",
      "contents": [
        { "kind": "block", "type": "controls_if" },
        { "kind": "block", "type": "logic_compare" },
        { "kind": "block", "type": "logic_operation" },
        { "kind": "block", "type": "logic_boolean" }
      ]
    },
    {
      "kind": "category",
      "name": "📝 Texto",
      "categorystyle": "texto_category",
      "contents": [
        { "kind": "block", "type": "text" },
        { "kind": "block", "type": "text_join" },
        { "kind": "block", "type": "text_print" }
      ]
    },
    {
      "kind": "category",
      "name": "🔧 Variáveis",
      "categorystyle": "variaveis_category",
      "custom": "VARIABLE"
    }
  ]
};
