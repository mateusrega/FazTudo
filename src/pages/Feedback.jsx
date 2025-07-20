// src/pages/Feedback.jsx
import React, { useState, useContext } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import Sidebar from "../components/Sidebar";

const Feedback = () => {
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("elogio");
  const { user } = useContext(UserContext);

  const enviarFeedback = async () => {
    if (!mensagem.trim()) return alert("Escreva algo no feedback.");

    try {
      await addDoc(collection(db, "feedbacks"), {
        userId: user?.uid || "desconhecido",
        mensagem,
        tipo,
        createdAt: serverTimestamp(),
      });
      setMensagem("");
      alert("Feedback enviado com sucesso!");
    } catch (error) {
      alert("Erro ao enviar feedback.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 p-6 w-full">
        <h1 className="text-3xl font-bold mb-6">📢 Enviar Feedback</h1>

        <div className="space-y-4 max-w-xl">
          <label className="block">
            Tipo:
            <select
              className="block mt-1 border p-2 rounded w-full"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="elogio">Elogio</option>
              <option value="sugestao">Sugestão</option>
              <option value="erro">Erro</option>
            </select>
          </label>

          <label className="block">
            Mensagem:
<textarea
  className="block mt-1 border p-2 rounded w-full h-32 resize-none"
  value={mensagem}
  onChange={(e) => setMensagem(e.target.value)}
  placeholder="Deixe seu feedback..."
/>
 </label>
<button
  onClick={enviarFeedback}
  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
>
  Enviar
</button>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
