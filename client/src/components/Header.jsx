// Header.jsx
// Top navigation bar for "Yes We Kanban"
// Props:
//   boardTitle: string — name of the current board (optional)
//   onAddColumn: () => void — opens the add-column dialog

// Header.jsx
import { useState } from "react";

export default function Header({ boardTitle = "My Board", onAddColumn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={styles.header}>

      {/* Logo */}
      <h1 style={styles.logo}>✓ Yes We Kanban</h1>

      {/* Board title */}
      <span style={styles.boardTitle}>/ {boardTitle}</span>

      {/* Right side actions */}
      <div style={styles.actions}>
        <button onClick={onAddColumn} style={styles.addBtn}>
          + Add Column
        </button>

        {/* Account menu */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen((v) => !v)} style={styles.avatarBtn}>
            Me
          </button>

          {menuOpen && (
            <div style={styles.dropdown}>
              <button style={styles.dropdownItem}>Profile</button>
              <button style={styles.dropdownItem}>Settings</button>
              <hr style={styles.divider} />
              <button
                style={{ ...styles.dropdownItem, color: "#e74c3c" }}
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

const styles = {
  header: {
    width: "100%",
    height: 60,
    background: "#ffffff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: 12,
    boxSizing: "border-box",
    flexShrink: 0,
  },
  logo: {
    margin: 0,
    fontSize: 18,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  boardTitle: {
    flex: 1,
    fontSize: 14,
    color: "#888",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  addBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: "bold",
    cursor: "pointer",
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#f0f2f5",
    border: "1px solid #ddd",
    fontSize: 11,
    fontWeight: "bold",
    cursor: "pointer",
    color: "#555",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "6px",
    minWidth: 140,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    zIndex: 100,
  },
  dropdownItem: {
    width: "100%",
    background: "none",
    border: "none",
    padding: "8px 12px",
    textAlign: "left",
    fontSize: 13,
    cursor: "pointer",
    borderRadius: 6,
    color: "#333",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #eee",
    margin: "4px 0",
  },
};