import React, { useState, useContext } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const { user } = useContext(UserContext);
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("sugestao");
  const navigate = useNavigate();

  const enviarFeedback = async (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return alert("Escreva sua mensagem!");

    try {
      await addDoc(collection(db, "feedbacks"), {
        userId: user?.uid || "anônimo",
        mensagem,
        tipo,
        createdAt: serverTimestamp(),
      });
      alert("Obrigado pelo seu feedback!");
      navigate("/dashboard");
    } catch (err) {
      alert("Erro ao enviar feedback.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Envie seu feedback</h1>

      <form onSubmit={enviarFeedback} className="flex flex-col gap-4">
        <label>
          Tipo:
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="sugestao">Sugestão</option>
            <option value="elogio">Elogio</option>
            <option value="erro">Erro/Bug</option>
            <option value="outro">Outro</option>
          </select>
        </label>

        <label>
          Mensagem:
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full border p-2 h-32 rounded mt-1"
            placeholder="Digite sua ideia, sugestão ou erro encontrado..."
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Feedback;
