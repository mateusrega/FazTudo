import React, { useState, useContext } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { UserContext } from "../contexts/UserContext";
import Sidebar from "../components/Sidebar";
import { FaHeart, FaLightbulb, FaBug, FaPaperPlane } from "react-icons/fa";

const Feedback = () => {
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState("elogio");
  const [enviando, setEnviando] = useState(false);
  const { user } = useContext(UserContext);

  const tipoOptions = [
    { value: "elogio", label: "Elogio", icon: FaHeart, color: "from-pink-500 to-red-500" },
    { value: "sugestao", label: "Sugestão", icon: FaLightbulb, color: "from-yellow-500 to-orange-500" },
    { value: "erro", label: "Reportar Bug", icon: FaBug, color: "from-red-500 to-red-600" },
  ];

  const enviarFeedback = async () => {
    if (!mensagem.trim()) {
      alert("Por favor, escreva algo no feedback.");
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        userId: user?.uid || "desconhecido",
        mensagem: mensagem.trim(),
        tipo,
        createdAt: serverTimestamp(),
      });
      
      setMensagem("");
      alert("Feedback enviado com sucesso! Obrigado pela contribuição! 🎉");
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      alert("Erro ao enviar feedback. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 pt-16 lg:pt-0">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            💬 Enviar Feedback
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Sua opinião é muito importante para melhorarmos o FazTudo!
          </p>
        </div>

        <div className="max-w-2xl mx-auto lg:mx-0">
          {/* Tipo de Feedback */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Tipo de Feedback
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {tipoOptions.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setTipo(value)}
                  className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                    tipo === value
                      ? `bg-gradient-to-r ${color} text-white border-transparent shadow-lg`
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`text-xl md:text-2xl mb-2 mx-auto ${tipo === value ? 'text-white' : 'text-gray-400'}`} />
                  <p className="font-semibold text-sm md:text-base">{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Mensagem */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Sua Mensagem
            </h2>
          <div>
  <textarea
    className="w-full h-32 md:h-40 p-3 md:p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
    value={mensagem}
    onChange={(e) => {
      if (e.target.value.length <= 500) {
        setMensagem(e.target.value);
      }
    }}
    maxLength={500}
    placeholder={
      tipo === "elogio"
        ? "Conte o que você mais gostou no FazTudo..."
        : tipo === "sugestao"
        ? "Que funcionalidade você gostaria de ver no FazTudo?"
        : "Descreva o problema que você encontrou..."
    }
  />
  <div className="text-right text-xs text-gray-500 mt-1">
    {mensagem.length}/500 caracteres
  </div>
</div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {mensagem.length}/500 caracteres
              </p>
              <p className="text-sm text-gray-500">
                {mensagem.trim().length === 0 ? "Campo obrigatório" : ""}
              </p>
            </div>
          </div>

          {/* Botão Enviar */}
          <button
            onClick={enviarFeedback}
            disabled={enviando || !mensagem.trim()}
            className={`w-full py-3 md:py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 text-sm md:text-base ${
              enviando || !mensagem.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg'
            }`}
          >
            {enviando ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Enviar Feedback
              </>
            )}
          </button>

          {/* Info adicional */}
          <div className="mt-4 md:mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 md:p-6">
            <h3 className="font-bold text-blue-900 mb-2 text-sm md:text-base">📋 Informações importantes:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Seu feedback é anônimo e seguro</li>
              <li>• Respondemos a sugestões em até 48h</li>
              <li>• Bugs reportados têm prioridade máxima</li>
              <li>• Elogios motivam nossa equipe! ❤️</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
