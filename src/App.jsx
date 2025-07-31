import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Feedback from "./pages/Feedback";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import VoicePage from "./pages/VoicePage"; // 🔥 nova importação
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<AdminFeedbacks />} />
          <Route path="/voz" element={<VoicePage />} /> {/* 🔥 nova rota */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
