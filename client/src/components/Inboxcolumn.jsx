// InboxColumn.jsx
// A persistent "Inbox" column for capturing new cards quickly.
// Props:
//   cards: [{ id, title, description }]
//   onAddCard(cardData) — adds card to inbox
//   onDeleteCard(cardId) — deletes from inbox
//   onDragOver, onDrop — for receiving dragged cards from other columns

import { useState, useRef, useEffect } from "react";

export default function InboxColumn({
  cards = [],
  onAddCard,
  onDeleteCard,
  onDragOver,
  onDrop,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAddCard({
      id: `card-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
    });
    setTitle("");
    setDescription("");
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div
      style={{
        ...styles.inbox,
        outline: isDragOver ? "2px dashed #f1c40f" : "2px solid transparent",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver && onDragOver(e, "inbox");
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop && onDrop(e, "inbox");
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <span style={styles.inboxIcon}>📥</span>
          <h3 style={styles.title}>Inbox</h3>
          <span style={styles.badge}>{cards.length}</span>
        </div>
        <div style={styles.accentLine} />
        <p style={styles.subtitle}>Capture anything. Sort it later.</p>
      </div>

      {/* Quick-add form — always visible at top */}
      <div style={styles.quickAdd}>
        {isAdding ? (
          <>
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              style={styles.input}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add details… (optional)"
              rows={2}
              style={{ ...styles.input, resize: "none", marginTop: 6 }}
            />
            <div style={styles.formActions}>
              <button onClick={handleSubmit} style={styles.addBtn}>
                ✓ Add to Inbox
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setTitle("");
                  setDescription("");
                }}
                style={styles.cancelBtn}
              >
                Discard
              </button>
            </div>
          </>
        ) : (
          <button onClick={() => setIsAdding(true)} style={styles.captureBtn}>
            <span style={styles.capturePlus}>+</span>
            <span>Capture a task…</span>
          </button>
        )}
      </div>

      {/* Card list */}
      <div style={styles.cardList}>
        {cards.length === 0 && !isAdding && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: 28 }}>🗂</span>
            <p style={styles.emptyText}>Your inbox is empty.</p>
            <p style={styles.emptySubtext}>
              Add something above or drag a card here.
            </p>
          </div>
        )}
        {cards.map((card) => (
          <InboxCard
            key={card.id}
            card={card}
            onDelete={() => onDeleteCard(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Sub-component: InboxCard ─────────────────────────────────────────────────

function InboxCard({ card, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      draggable
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        boxShadow: hovered
          ? "0 6px 20px rgba(0,0,0,0.4)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div style={styles.cardContent}>
        <span style={styles.cardDot} />
        <div style={styles.cardBody}>
          <p style={styles.cardTitle}>{card.title}</p>
          {card.description && (
            <p style={styles.cardDesc}>{card.description}</p>
          )}
        </div>
      </div>
      <button
        onClick={onDelete}
        title="Remove"
        style={{ ...styles.deleteBtn, opacity: hovered ? 1 : 0 }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  inbox: {
    width: 290,
    minWidth: 290,
    background: "#12122a",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(241,196,15,0.2)",
    flexShrink: 0,
    transition: "outline 0.15s ease",
  },
  header: {
    padding: "16px 16px 0",
    background: "linear-gradient(135deg, #1a1a3a 0%, #12122a 100%)",
    borderRadius: "12px 12px 0 0",
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  inboxIcon: { fontSize: 18 },
  title: {
    margin: 0,
    flex: 1,
    fontFamily: "'Bebas Neue', Impact, sans-serif",
    fontSize: 22,
    letterSpacing: 2,
    color: "#f1c40f",
    textTransform: "uppercase",
  },
  badge: {
    background: "rgba(241,196,15,0.15)",
    color: "#f1c40f",
    borderRadius: 12,
    padding: "2px 9px",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "monospace",
  },
  accentLine: {
    height: 2,
    background: "linear-gradient(90deg, #f1c40f, transparent)",
    marginTop: 10,
    borderRadius: 2,
  },
  subtitle: {
    margin: "8px 0 14px",
    color: "#6a6a8a",
    fontSize: 11,
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  quickAdd: {
    padding: "0 12px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  captureBtn: {
    width: "100%",
    background: "rgba(241,196,15,0.07)",
    border: "1px dashed rgba(241,196,15,0.3)",
    borderRadius: 8,
    color: "#9a9a70",
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
    transition: "background 0.15s ease",
  },
  capturePlus: {
    fontSize: 20,
    color: "#f1c40f",
    lineHeight: 1,
  },
  input: {
    width: "100%",
    background: "#0d0d1a",
    border: "1px solid rgba(241,196,15,0.25)",
    borderRadius: 6,
    color: "#eae0d5",
    padding: "8px 10px",
    fontSize: 13,
    fontFamily: "'Georgia', serif",
    outline: "none",
    boxSizing: "border-box",
  },
  formActions: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  addBtn: {
    background: "#f1c40f",
    border: "none",
    borderRadius: 6,
    color: "#0d0d1a",
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: 900,
    cursor: "pointer",
    fontFamily: "'Bebas Neue', sans-serif",
    letterSpacing: 1,
  },
  cancelBtn: {
    background: "none",
    border: "none",
    color: "#6a6a8a",
    padding: "7px 10px",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'Georgia', serif",
  },
  cardList: {
    padding: "10px 12px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    maxHeight: "calc(100vh - 280px)",
  },
  card: {
    background: "#1e1e3a",
    borderRadius: 8,
    padding: "10px 10px 10px 14px",
    borderLeft: "4px solid #f1c40f",
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    cursor: "grab",
    transition: "box-shadow 0.2s ease, transform 0.2s ease",
  },
  cardContent: {
    display: "flex",
    gap: 10,
    flex: 1,
    alignItems: "flex-start",
  },
  cardDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#f1c40f",
    flexShrink: 0,
    marginTop: 5,
  },
  cardBody: { flex: 1 },
  cardTitle: {
    margin: 0,
    color: "#eae0d5",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Georgia', serif",
    lineHeight: 1.4,
  },
  cardDesc: {
    margin: "4px 0 0",
    color: "#6a6a8a",
    fontSize: 11,
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
    flexShrink: 0,
    transition: "opacity 0.15s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
  },
  emptyText: {
    margin: 0,
    color: "#4a4a6a",
    fontFamily: "'Georgia', serif",
    fontSize: 14,
    fontWeight: 600,
  },
  emptySubtext: {
    margin: 0,
    color: "#3a3a5a",
    fontFamily: "'Georgia', serif",
    fontStyle: "italic",
    fontSize: 12,
  },
};
