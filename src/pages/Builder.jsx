import React from "react";
import DragAndDrop from "../components/DragAndDrop";
import Sidebar from "../components/Sidebar";

export default function Builder() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-semibold mb-4">Criador de Automações</h1>
        <DragAndDrop />
      </div>
    </div>
  );
}
