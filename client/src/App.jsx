import { useState } from "react";
import Login from "./pages/Login";
import Board from "./pages/Board";

export default function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { loggedIn: true } : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={(u) => setUser(u)} />;
  }

  return <Board onLogout={handleLogout} />;
}
