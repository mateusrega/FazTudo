export const toolbox = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "🔁 Gatilhos",
      "colour": "#00FFF7",
      "contents": [
        { "kind": "block", "type": "webhook_trigger" },
        { "kind": "block", "type": "button_click_trigger" },
        { "kind": "block", "type": "voice_command_trigger" }
      ]
    },
    {
      "kind": "category",
      "name": "📲 Ações",
      "colour": "#00FF85",
      "contents": [
        { "kind": "block", "type": "whatsapp_message" },
        { "kind": "block", "type": "google_sheets_save" },
        { "kind": "block", "type": "telegram_notification" },
        { "kind": "block", "type": "auto_reply" }
      ]
    },
    {
      "kind": "category",
      "name": "🧠 Lógica",
      "colour": "#FFFD00",
      "contents": [
        { "kind": "block", "type": "bloco_if_else" },
        { "kind": "block", "type": "logic_compare" },
        { "kind": "block", "type": "logic_operation" },
        { "kind": "block", "type": "logic_boolean" }
      ]
    },
    {
      "kind": "category",
      "name": "🔤 Texto",
      "colour": "#FF44FF",
      "contents": [
        { "kind": "block", "type": "text" },
        { "kind": "block", "type": "text_join" },
        { "kind": "block", "type": "text_print" }
      ]
    },
    {
      "kind": "category",
      "name": "⚙️ Variáveis",
      "colour": "#FFAA00",
      "custom": "VARIABLE"
    }
  ]
};
