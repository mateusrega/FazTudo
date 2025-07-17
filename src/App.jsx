// src/App.jsx
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
  const [modoEmergencia, setModoEmergencia] = useState(true); // ATIVE PARA LIBERAR ACESSO SEM LOGIN

  if (!user && !modoEmergencia) {
    return <Navigate to="/login" />;
  }

  return (
    <UserProvider value={{ user: user || (modoEmergencia && {
      uid: "emergencia",
      email: "emergencia@faztudo.dev",
      displayName: "Modo Emergência",
      isEmergencia: true,
    }), setUser }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

