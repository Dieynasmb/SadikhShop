
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const adminUsername =
      import.meta.env.VITE_ADMIN_USERNAME || "admin";

    const adminPassword =
      import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

    if (
      username.trim() === adminUsername &&
      password === adminPassword
    ) {
      localStorage.setItem("alchimiaShopAdmin", "true");
      navigate("/admin", { replace: true });
      return;
    }

    setError("Identifiant ou mot de passe incorrect.");
  }

  return (
    <main className="login-page">
      <div className="login-background" />

      <section className="login-card">
        <Link to="/" className="home-logo login-logo">
          <span className="home-logo-icon">
            <ShoppingBag size={24} />
          </span>

          <span>
            ALCHIMIA<span className="home-logo-accent">SHOP</span>
          </span>
        </Link>

        <div className="login-icon">
          <LockKeyhole size={28} />
        </div>

        <span className="home-eyebrow home-eyebrow-dark">
          ESPACE PRIVÉ
        </span>

        <h1>Administration</h1>

        <p className="login-description">
          Connecte-toi pour accéder à ton espace de gestion.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-username">Identifiant</label>

          <input
            id="admin-username"
            type="text"
            autoComplete="username"
            placeholder="Ton identifiant"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Mot de passe</label>

          <div className="login-password-field">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Ton mot de passe"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              className="login-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-submit">
            Se connecter
          </button>
        </form>

        <div className="login-security-note">
          <ShieldCheck size={18} />
          <span>Accès réservé à l'administration.</span>
        </div>

        <Link to="/" className="login-back-link">
          <ArrowLeft size={17} />
          Retour à la boutique
        </Link>
      </section>
    </main>
  );
}
