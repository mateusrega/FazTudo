// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/builder", label: "Builder" },
    { to: "/feedback", label: "Feedback" },
  ];

  return (
    <aside className="min-h-screen w-60 bg-white border-r px-4 py-8 fixed">
      <h1 className="text-2xl font-bold mb-8 text-green-600">FazTudo</h1>
      <nav className="space-y-4">
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`block px-4 py-2 rounded hover:bg-green-50 ${
              pathname === to ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
