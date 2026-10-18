import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./assets/pages/Home.jsx";
import Boutique from "./assets/pages/Boutique.jsx";
import AdminLogin from "./assets/pages/AdminLogin.jsx";
import Admin from "./assets/pages/Admin.jsx";

import "./App.css";

function NotFound() {
  return (
    <main className="app-not-found">
      <h1>404</h1>
      <h2>Page introuvable</h2>
      <p>La page recherchée n'existe pas.</p>
      <a href="/">Retour à l'accueil</a>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boutique" element={<Boutique />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}