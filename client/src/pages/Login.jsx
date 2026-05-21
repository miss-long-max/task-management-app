// Login.jsx
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3004";

export default function Login({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" or "register"

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <h1 style={styles.logo}>✓ Yes We Kanban</h1>

        {/* Toggle buttons */}
        <div style={styles.tabs}>
          <button
            onClick={() => setMode("login")}
            style={mode === "login" ? styles.tabActive : styles.tab}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            style={mode === "register" ? styles.tabActive : styles.tab}
          >
            Create Account
          </button>
        </div>

        {/* Show the right form */}
        {mode === "login" ? (
          <LoginForm
            onLoginSuccess={onLoginSuccess}
            onSwitch={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onLoginSuccess={onLoginSuccess}
            onSwitch={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}

// ── Login Form ──────────────────────────────────────────────

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
      onLoginSuccess(data.user);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>Welcome back</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p style={styles.switchText}>
        No account?{" "}
        <span style={styles.link} onClick={onSwitch}>
          Create one
        </span>
      </p>
    </div>
  );
}

// ── Register Form ───────────────────────────────────────────

function RegisterForm({ onLoginSuccess, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      onLoginSuccess(data.user);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={styles.heading}>Create your account</h2>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p style={styles.switchText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={onSwitch}>
          Sign in
        </span>
      </p>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#ffffff",
    borderRadius: 10,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  logo: {
    margin: "0 0 24px",
    fontSize: 22,
    color: "#e74c3c",
    textAlign: "center",
  },
  tabs: {
    display: "flex",
    marginBottom: 24,
    borderRadius: 8,
    overflow: "hidden",
    border: "1px solid #e74c3c",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "#fff",
    border: "none",
    color: "#e74c3c",
    fontSize: 14,
    cursor: "pointer",
  },
  tabActive: {
    flex: 1,
    padding: "10px",
    background: "#e74c3c",
    border: "none",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
    fontWeight: "bold",
  },
  heading: {
    margin: "0 0 20px",
    fontSize: 18,
    color: "#333",
  },
  field: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 15,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 8,
  },
  error: {
    color: "#e74c3c",
    background: "#fdecea",
    border: "1px solid #f5c6cb",
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 13,
    marginBottom: 16,
  },
  switchText: {
    textAlign: "center",
    fontSize: 13,
    color: "#888",
    marginTop: 20,
  },
  link: {
    color: "#e74c3c",
    cursor: "pointer",
    fontWeight: "bold",
  },
};