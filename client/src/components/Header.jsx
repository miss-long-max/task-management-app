// Header.jsx
// Top navigation bar for "Yes We Kanban"
// Props:
//   boardTitle: string — name of the current board (optional)
//   onAddColumn: () => void — opens the add-column dialog

import { useState } from "react";

export default function Header({ boardTitle = "My Board", onAddColumn }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Google Font import — add this to your index.html <head> instead if preferred */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lora:ital@0;1&display=swap');`}</style>

      <header style={styles.header}>
        {/* Logo / Wordmark */}
        <div style={styles.logoBlock}>
          <span style={styles.logoMark}>✓</span>
          <div style={styles.logoText}>
            <span style={styles.logoYes}>Yes We</span>
            <span style={styles.logoKanban}>Kanban</span>
          </div>
        </div>

        {/* Board title */}
        <div style={styles.boardTitle}>
          <span style={styles.boardTitleSlash}>/</span>
          <span style={styles.boardTitleText}>{boardTitle}</span>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button onClick={onAddColumn} style={styles.addColumnBtn}>
            <span style={{ fontSize: 16 }}>＋</span> Add Column
          </button>

          {/* Avatar / menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={styles.avatar}
              title="Account"
            >
              YWK
            </button>
            {menuOpen && (
              <div style={styles.dropdown}>
                <DropdownItem label="Profile" />
                <DropdownItem label="Settings" />
                <div style={styles.dropdownDivider} />
                <DropdownItem label="Log out" danger />
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function DropdownItem({ label, danger }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.dropdownItem,
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
        color: danger ? "#e74c3c" : "#eae0d5",
      }}
    >
      {label}
    </button>
  );
}

const styles = {
  header: {
    width: "100%",
    height: 62,
    background: "#0d0d1a",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    gap: 0,
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  },
  logoBlock: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
  },
  logoMark: {
    width: 34,
    height: 34,
    background: "#e74c3c",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: 900,
    flexShrink: 0,
  },
  logoText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
  },
  logoYes: {
    fontFamily: "'Lora', Georgia, serif",
    fontStyle: "italic",
    fontSize: 10,
    color: "#9a9ab0",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  logoKanban: {
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: 22,
    color: "#fff",
    letterSpacing: 2,
  },
  boardTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginLeft: 20,
    flex: 1,
  },
  boardTitleSlash: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 20,
    fontFamily: "monospace",
  },
  boardTitleText: {
    color: "#eae0d5",
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 15,
    fontStyle: "italic",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  addColumnBtn: {
    background: "rgba(231,76,60,0.15)",
    border: "1px solid rgba(231,76,60,0.4)",
    color: "#e74c3c",
    borderRadius: 7,
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: 1,
    transition: "background 0.15s ease",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#22223b",
    border: "2px solid rgba(255,255,255,0.15)",
    color: "#eae0d5",
    fontSize: 10,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "monospace",
    letterSpacing: 1,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    background: "#1a1a2e",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 9,
    padding: "6px",
    minWidth: 160,
    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  dropdownItem: {
    width: "100%",
    border: "none",
    borderRadius: 6,
    padding: "9px 14px",
    textAlign: "left",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Lora', Georgia, serif",
    transition: "background 0.1s ease",
  },
  dropdownDivider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "4px 0",
  },
};
