// KanbanColumn.jsx
// A single draggable column on the Kanban board.
// Props:
//   column: { id, title, color, cards: [{ id, title, description }] }
//   onDragStart, onDragOver, onDrop — passed from the Board parent
//   onAddCard(columnId, cardData) — adds a new card to this column
//   onDeleteCard(columnId, cardId) — removes a card

import { useState, useRef } from "react";

const COLUMN_COLORS = {
  red: { bg: "#C0392B", light: "#E74C3C" },
  yellow: { bg: "#D4AC0D", light: "#F1C40F" },
  green: { bg: "#1E8449", light: "#27AE60" },
  blue: { bg: "#1A5276", light: "#2980B9" },
  purple: { bg: "#6C3483", light: "#8E44AD" },
  slate: { bg: "#2C3E50", light: "#34495E" },
};

export default function KanbanColumn({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onAddCard,
  onDeleteCard,
}) {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDesc, setNewCardDesc] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const color = COLUMN_COLORS[column.color] || COLUMN_COLORS.slate;

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(column.id, {
      id: `card-${Date.now()}`,
      title: newCardTitle.trim(),
      description: newCardDesc.trim(),
    });
    setNewCardTitle("");
    setNewCardDesc("");
    setAddingCard(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddCard();
    }
    if (e.key === "Escape") {
      setAddingCard(false);
      setNewCardTitle("");
      setNewCardDesc("");
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, column.id)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver(e, column.id);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, column.id);
      }}
      style={{
        ...styles.column,
        outline: isDragOver
          ? `2px dashed ${color.light}`
          : "2px solid transparent",
        opacity: isDragOver ? 0.85 : 1,
      }}
    >
      {/* Column Header */}
      <div style={{ ...styles.columnHeader, background: color.bg }}>
        <div style={styles.columnHeaderInner}>
          <span style={styles.columnDragHandle} title="Drag to reorder">
            ⠿
          </span>
          <h3 style={styles.columnTitle}>{column.title}</h3>
          <span style={styles.cardCount}>{column.cards.length}</span>
        </div>
        <div style={{ ...styles.columnAccentLine, background: color.light }} />
      </div>

      {/* Cards */}
      <div style={styles.cardList}>
        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            accentColor={color.light}
            onDelete={() => onDeleteCard(column.id, card.id)}
          />
        ))}

        {/* Add Card Form */}
        {addingCard ? (
          <div style={styles.addCardForm}>
            <input
              ref={inputRef}
              autoFocus
              placeholder="Card title…"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.addCardInput}
            />
            <textarea
              placeholder="Description (optional)"
              value={newCardDesc}
              onChange={(e) => setNewCardDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              style={{ ...styles.addCardInput, resize: "none", marginTop: 6 }}
            />
            <div style={styles.addCardActions}>
              <button
                onClick={handleAddCard}
                style={{ ...styles.btn, background: color.bg }}
              >
                Add Card
              </button>
              <button
                onClick={() => {
                  setAddingCard(false);
                  setNewCardTitle("");
                  setNewCardDesc("");
                }}
                style={styles.btnGhost}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            style={styles.addCardTrigger}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            <span>Add a card</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Sub-component: KanbanCard ────────────────────────────────────────────────

function KanbanCard({ card, accentColor, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: hovered
          ? "0 6px 20px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardBody}>
        <p style={styles.cardTitle}>{card.title}</p>
        {card.description && <p style={styles.cardDesc}>{card.description}</p>}
      </div>
      <button
        onClick={onDelete}
        title="Delete card"
        style={{
          ...styles.deleteBtn,
          opacity: hovered ? 1 : 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  column: {
    width: 280,
    minWidth: 280,
    background: "#1a1a2e",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    transition: "outline 0.15s ease, opacity 0.15s ease",
    cursor: "grab",
    userSelect: "none",
    flexShrink: 0,
  },
  columnHeader: {
    borderRadius: "10px 10px 0 0",
    padding: "14px 16px 0",
  },
  columnHeaderInner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  columnDragHandle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.4)",
    cursor: "grab",
    letterSpacing: -2,
  },
  columnTitle: {
    flex: 1,
    margin: 0,
    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
    fontSize: 20,
    letterSpacing: 1.5,
    color: "#fff",
    textTransform: "uppercase",
  },
  cardCount: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: 12,
    padding: "2px 9px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  columnAccentLine: {
    height: 3,
    borderRadius: 2,
    marginTop: 10,
  },
  cardList: {
    padding: "12px 12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
    maxHeight: "calc(100vh - 220px)",
    cursor: "default",
  },
  card: {
    background: "#22223b",
    borderRadius: 7,
    padding: "12px 10px 12px 14px",
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
    cursor: "pointer",
  },
  cardBody: { flex: 1 },
  cardTitle: {
    margin: 0,
    color: "#eae0d5",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Georgia', serif",
    lineHeight: 1.4,
  },
  cardDesc: {
    margin: "5px 0 0",
    color: "#9a9ab0",
    fontSize: 12,
    fontFamily: "'Georgia', serif",
    lineHeight: 1.5,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#c0392b",
    fontSize: 18,
    lineHeight: 1,
    cursor: "pointer",
    padding: "0 2px",
    transition: "opacity 0.15s ease",
    flexShrink: 0,
  },
  addCardTrigger: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px dashed rgba(255,255,255,0.15)",
    borderRadius: 7,
    color: "#9a9ab0",
    padding: "9px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    cursor: "pointer",
    transition: "background 0.15s ease, color 0.15s ease",
    fontFamily: "'Georgia', serif",
  },
  addCardForm: {
    background: "#2c2c4a",
    borderRadius: 7,
    padding: 12,
    display: "flex",
    flexDirection: "column",
  },
  addCardInput: {
    background: "#1a1a2e",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 5,
    color: "#eae0d5",
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: "'Georgia', serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  addCardActions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  btn: {
    border: "none",
    borderRadius: 5,
    color: "#fff",
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: 1,
  },
  btnGhost: {
    background: "none",
    border: "none",
    color: "#9a9ab0",
    padding: "7px 10px",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
};
