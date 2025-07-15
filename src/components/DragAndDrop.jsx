import React, { useState } from "react";
import { FaWhatsapp, FaGoogleDrive, FaTelegramPlane, FaReply, FaLink } from "react-icons/fa";

const componentsList = [
  { name: "Mensagem WhatsApp", type: "action", icon: <FaWhatsapp /> },
  { name: "Salvar no Google Sheets", type: "action", icon: <FaGoogleDrive /> },
  { name: "Notificação Telegram", type: "action", icon: <FaTelegramPlane /> },
  { name: "Resposta Automática", type: "action", icon: <FaReply /> },
  { name: "Gatilho Webhook", type: "trigger", icon: <FaLink /> }
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

  const exportFlow = () => {
    const exportData = flow.map((item, index) => ({
      id: index,
      name: item.name,
      type: item.type
    }));
    alert(JSON.stringify(exportData, null, 2));
  };

  return (
    <div className="flex h-full p-4 gap-4">
      <div className="w-1/4 bg-gray-100 p-4 rounded shadow">
        <h2 className="font-bold mb-2">Componentes</h2>
        {componentsList.map(({ name, icon }) => (
          <div
            key={name}
            draggable
            onDragStart={(e) => handleDragStart(e, name)}
            className="bg-white p-2 mb-2 rounded border shadow cursor-grab flex items-center gap-2"
          >
            {icon} {name}
          </div>
        ))}
        <button
          onClick={exportFlow}
          className="mt-4 bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Exportar JSON
        </button>
      </div>

      <div
        className="flex-1 bg-white p-4 border rounded shadow min-h-[300px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <h2 className="font-bold mb-2">Fluxo de Automações</h2>
        {flow.length === 0 && (
          <p className="text-gray-400">Arraste um componente para cá</p>
        )}
        {flow.map((item, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded border flex items-center gap-2 ${
              item.type === 'trigger'
                ? 'bg-yellow-100 border-yellow-400'
                : 'bg-green-100 border-green-400'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
