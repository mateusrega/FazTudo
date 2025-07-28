import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Feedback from "./pages/Feedback";
import AdminFeedbacks from "./pages/AdminFeedbacks";
import { UserProvider } from "./contexts/UserContext"; // garante que o contexto funcione

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
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
