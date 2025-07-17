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

  return (
    <UserProvider>
      <Router>
        {/* Mostra login apenas se não estiver logado nem em modo teste */}
        {!user && !testingMode ? (
          <div style={{ padding: "2rem" }}>
            <h1>Login</h1>
            <Login onLogin={(u) => setUser(u)} />
            <hr />
            <button onClick={() => setTestingMode(true)}>Entrar como teste (sem login)</button>
          </div>
        ) : (
          <>
            <div style={{ padding: "1rem", background: "#eee" }}>
              <p>
                {testingMode
                  ? "Modo teste ativo"
                  : `Usuário logado: ${user?.email || "Desconhecido"}`}
              </p>
              <button onClick={() => { setUser(null); setTestingMode(false); }}>
                Sair
              </button>
            </div>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/builder/:id" element={<Builder />} />
              {/* Áreas protegidas */}
              {user && (
                <>
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
                </>
              )}
              {/* Redirecionamento padrão */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </>
        )}
      </Router>
    </UserProvider>
  );
}

export default App;
