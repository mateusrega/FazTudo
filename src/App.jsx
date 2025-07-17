import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Feedback from "./pages/Feedback";
import AdminFeedbacks from "./pages/AdminFeedbacks";

import { UserProvider } from "./contexts/UserContext";

function App() {
  const [user, setUser] = useState(null);
  const [testingMode, setTestingMode] = useState(false);

  // Se não estiver logado nem em modo teste, mostra tela de login
  if (!user && !testingMode) {
    return (
      <div>
        <h1>Login</h1>
        {/* Aqui pode vir o seu componente/formulário de Login */}
        <button onClick={() => setTestingMode(true)}>Entrar como teste (sem login)</button>
      </div>
    );
  }

  // Se logado ou em modo teste, mostra o app com rotas
  return (
    <UserProvider>
      <Router>
        <div>
          <p>{testingMode ? "Modo teste ativo" : `Usuário logado: ${user?.email}`}</p>
          <button
            onClick={() => {
              setTestingMode(false);
              setUser(null);
            }}
          >
            Sair
          </button>
        </div>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
