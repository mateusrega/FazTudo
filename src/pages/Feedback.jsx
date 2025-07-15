// src/pages/Feedback.jsx
import React, { useState, useContext } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";

const Feedback = () => {
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("sugestao");
  const { user } = useContext(UserContext);

  const enviarFeedback = async () => {
    if (!mensagem) return alert("Preencha a mensagem!");

    await addDoc(collection(db, "feedbacks"), {
      userId: user.uid,
      mensagem,
      tipo,
      createdAt: serverTimestamp(),
    });

    alert("Feedback enviado com sucesso!");
    setMensagem("");
    setTipo("sugestao");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">💬 Enviar Feedback</h1>

      <label className="block mb-2 font-medium">Tipo:</label>
      <select
        className="w-full border p-2 rounded bg-gray-50"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
      >
        <option value="sugestao">Sugestão</option>
        <option value="erro">Erro</option>
        <option value="elogio">Elogio</option>
        <option value="outro">Outro</option>
      </select>

      <label className="block mt-4 mb-2 font-medium">Mensagem:</label>
      <textarea
        className="w-full border p-3 rounded bg-gray-50"
        rows="4"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
      ></textarea>

      <button
        onClick={enviarFeedback}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Enviar
      </button>
    </div>
  );
};

export default Feedback;
