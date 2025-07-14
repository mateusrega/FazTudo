import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import Feedback from "./pages/Feedback";
import { UserProvider } from "./contexts/UserContext";
import AdminFeedbacks from "./pages/AdminFeedbacks";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<Builder />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
