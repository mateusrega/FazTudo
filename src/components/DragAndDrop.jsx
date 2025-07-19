import React, { useState } from "react";
import { FaWhatsapp, FaGoogleDrive, FaTelegramPlane, FaReply, FaLink } from "react-icons/fa";

const componentsList = [
  { name: "Gatilho Webhook", type: "trigger", icon: <FaLink /> },
  { name: "Mensagem WhatsApp", type: "action", icon: <FaWhatsapp /> },
  { name: "Salvar no Google Sheets", type: "action", icon: <FaGoogleDrive /> },
  { name: "Notificação Telegram", type: "action", icon: <FaTelegramPlane /> },
  { name: "Resposta Automática", type: "action", icon: <FaReply /> }
];

export default function DragAndDrop() {
  const [flow, setFlow] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    const name = e.dataTransfer.getData("text/plain");
    const component = componentsList.find((c) => c.name === name);
    if (component) {
      setFlow((prev) => [...prev, component]);
    }
  };

  const handleDragStart = (e, name) => {
    e.dataTransfer.setData("text/plain", name);
  };

  return (
    <div className="flex h-full p-4 gap-4 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      {/* Blocos disponíveis */}
      <div className="w-1/4 bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-purple-700">Blocos</h2>
        {componentsList.map(({ name, icon, type }) => (
          <div
            key={name}
            draggable
            onDragStart={(e) => handleDragStart(e, name)}
            className={`p-3 mb-3 rounded-md shadow flex items-center gap-2 cursor-grab select-none transition hover:scale-105 ${
              type === "trigger"
                ? "bg-yellow-300 border-l-4 border-yellow-600"
                : "bg-green-300 border-l-4 border-green-600"
            }`}
          >
            {icon} <span className="font-medium">{name}</span>
          </div>
        ))}
      </div>

      {/* Área do fluxo */}
      <div
        className="flex-1 bg-white p-4 rounded-xl shadow-lg border-2 border-dashed border-gray-300"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2 className="text-lg font-bold mb-4 text-blue-700">Fluxo</h2>

        {flow.length === 0 ? (
          <p className="text-gray-400 italic">Arraste os blocos para criar seu fluxo</p>
        ) : (
          flow.map((item, index) => (
            <div
              key={index}
              className={`p-3 mb-3 rounded-md flex items-center gap-2 select-none ${
                item.type === "trigger"
                  ? "bg-yellow-200 border-l-4 border-yellow-600"
                  : "bg-green-200 border-l-4 border-green-600"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
