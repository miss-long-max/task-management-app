// Login.jsx
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

export default function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [animating, setAnimating] = useState(false);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setAnimating(true);
    setTimeout(() => {
      setMode(newMode);
      setAnimating(false);
    }, 220);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .auth-page {
          min-height: 100vh;
          background: #0a0a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Lora', Georgia, serif;
          position: relative;
          overflow: hidden;
        }

        .auth-page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(231,76,60,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(231,76,60,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Glowing orb behind card */
        .auth-page::after {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(231,76,60,0.07) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-16px); }
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #12122a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 48px 44px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          position: relative;
          z-index: 1;
          animation: fadeUp 0.45s ease both;
        }

        .auth-card.animating {
          animation: fadeOut 0.22s ease both;
        }

        /* ── Logo ── */
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .auth-logo-mark {
          width: 40px;
          height: 40px;
          background: #e74c3c;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          flex-shrink: 0;
        }
        .auth-logo-yes {
          font-family: 'Lora', serif;
          font-style: italic;
          font-size: 10px;
          color: #6a6a8a;
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
          line-height: 1;
        }
        .auth-logo-kanban {
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 24px;
          color: #fff;
          letter-spacing: 2px;
          display: block;
          line-height: 1;
        }

        /* ── Mode toggle tabs ── */
        .auth-tabs {
          display: flex;
          background: #0a0a1a;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 32px;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .auth-tab {
          flex: 1;
          padding: 9px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #6a6a8a;
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 15px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .auth-tab.active {
          background: #e74c3c;
          color: #fff;
        }

        /* ── Headings ── */
        .auth-heading {
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 30px;
          color: #eae0d5;
          letter-spacing: 2px;
          margin: 0 0 4px;
        }
        .auth-subheading {
          font-size: 13px;
          color: #6a6a8a;
          font-style: italic;
          margin: 0 0 28px;
        }

        /* ── Register perks banner ── */
        .register-perks {
          background: linear-gradient(135deg, rgba(231,76,60,0.1), rgba(241,196,15,0.05));
          border: 1px solid rgba(231,76,60,0.2);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #b0a898;
        }
        .perk-icon {
          width: 24px;
          height: 24px;
          background: rgba(231,76,60,0.15);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        /* ── Form fields ── */
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .auth-label {
          font-size: 11px;
          font-weight: 600;
          color: #9a9ab0;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .auth-input {
          background: #0a0a1a;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #eae0d5;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'Lora', serif;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
        }
        .auth-input:focus {
          border-color: rgba(231,76,60,0.5);
          box-shadow: 0 0 0 3px rgba(231,76,60,0.1);
        }

        /* ── Password strength bar ── */
        .strength-bar-wrap {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          margin-top: 6px;
          overflow: hidden;
        }
        .strength-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .strength-label {
          font-size: 11px;
          margin-top: 4px;
          font-style: italic;
        }

        /* ── Error / success ── */
        .auth-error {
          background: rgba(231,76,60,0.1);
          border: 1px solid rgba(231,76,60,0.3);
          border-radius: 8px;
          color: #e74c3c;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 16px;
          font-style: italic;
        }
        .auth-success {
          background: rgba(39,174,96,0.1);
          border: 1px solid rgba(39,174,96,0.3);
          border-radius: 8px;
          color: #27ae60;
          padding: 10px 14px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        /* ── Submit button ── */
        .auth-btn {
          width: 100%;
          background: #e74c3c;
          border: none;
          border-radius: 8px;
          color: #fff;
          padding: 14px;
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 18px;
          letter-spacing: 2px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .auth-btn:hover:not(:disabled) {
          background: #c0392b;
          transform: translateY(-1px);
        }
        .auth-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .auth-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 24px 0;
        }

        .auth-footer {
          text-align: center;
          font-size: 12px;
          color: #4a4a6a;
          font-style: italic;
        }
      `}</style>

      <div className="auth-page">
        <div className={`auth-card ${animating ? "animating" : ""}`}>
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-mark">✓</div>
            <div>
              <span className="auth-logo-yes">Yes We</span>
              <span className="auth-logo-kanban">Kanban</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => switchMode("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => switchMode("register")}
            >
              Create Account
            </button>
          </div>

          {/* Render the correct form */}
          {mode === "login" ? (
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              onSwitch={() => switchMode("register")}
            />
          ) : (
            <RegisterForm
              onLoginSuccess={onLoginSuccess}
              onSwitch={() => switchMode("login")}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onLoginSuccess, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      if (onLoginSuccess) onLoginSuccess(data.user);
    } catch {
      setError("Could not connect to the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="auth-heading">Welcome Back</h1>
      <p className="auth-subheading">Sign in to your board</p>

      {error && <div className="auth-error">⚠ {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="auth-divider" />
      <div className="auth-footer">
        No account yet?{" "}
        <span
          style={{ color: "#e74c3c", cursor: "pointer", fontStyle: "normal" }}
          onClick={onSwitch}
        >
          Create one free
        </span>
      </div>
    </>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({ onLoginSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength
  const getStrength = (pw) => {
    if (!pw) return { score: 0, label: "", color: "transparent" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const map = [
      { label: "", color: "transparent" },
      { label: "Weak", color: "#e74c3c" },
      { label: "Fair", color: "#e67e22" },
      { label: "Good", color: "#f1c40f" },
      { label: "Strong", color: "#27ae60" },
    ];
    return { score, ...map[score] };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not create account.");
        return;
      }

      localStorage.setItem("token", data.token);
      setSuccess("Account created! Taking you to your board…");
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(data.user);
      }, 1200);
    } catch {
      setError("Could not connect to the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="auth-heading">Create Account</h1>
      <p className="auth-subheading">Your boards are waiting</p>

      {/* Perks banner */}
      <div className="register-perks">
        <div className="perk-item">
          <div className="perk-icon">📋</div>
          Unlimited boards & columns
        </div>
        <div className="perk-item">
          <div className="perk-icon">🃏</div>
          Drag-and-drop task cards
        </div>
        <div className="perk-item">
          <div className="perk-icon">📥</div>
          Inbox to capture ideas fast
        </div>
      </div>

      {error && <div className="auth-error">⚠ {error}</div>}
      {success && <div className="auth-success">✓ {success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Full Name</label>
          <input
            className="auth-input"
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {password && (
            <>
              <div className="strength-bar-wrap">
                <div
                  className="strength-bar"
                  style={{
                    width: `${(strength.score / 4) * 100}%`,
                    background: strength.color,
                  }}
                />
              </div>
              <span
                className="strength-label"
                style={{ color: strength.color }}
              >
                {strength.label} password
              </span>
            </>
          )}
        </div>

        <button className="auth-btn" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create My Account"}
        </button>
      </form>

      <div className="auth-divider" />
      <div className="auth-footer">
        Already have an account?{" "}
        <span
          style={{ color: "#e74c3c", cursor: "pointer", fontStyle: "normal" }}
          onClick={onSwitch}
        >
          Sign in
        </span>
      </div>
    </>
  );
}
