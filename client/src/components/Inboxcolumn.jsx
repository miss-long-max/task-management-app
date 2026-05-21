// InboxColumn.jsx
import { useState } from "react";

export default function InboxColumn({
  cards = [],
  onAddCard,
  onDeleteCard,
  onDragOver,
  onDrop,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAddCard({
      id: `card-${Date.now()}`,
      title: title.trim(),
      description: "",
    });
    setTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setIsAdding(false);
      setTitle("");
    }
  };

  return (
    <div
      style={{
        ...styles.inbox,
        border: isDragOver ? "2px dashed #e74c3c" : "2px solid transparent",
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
        <span style={styles.title}>📥 Inbox</span>
        <span style={styles.count}>{cards.length}</span>
      </div>

      {/* Add card area */}
      <div style={styles.addArea}>
        {isAdding ? (
          <div style={styles.addForm}>
            <input
              autoFocus
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />
            <div style={styles.addFormActions}>
              <button onClick={handleAdd} style={styles.addBtn}>
                Add
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setTitle("");
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} style={styles.captureBtn}>
            + Capture a task
          </button>
        )}
      </div>

      {/* Card list */}
      <div style={styles.cardList}>
        {cards.length === 0 && !isAdding && (
          <p style={styles.emptyText}>No items yet. Add something above.</p>
        )}
        {cards.map((card) => (
          <div key={card.id} style={styles.card}>
            <span style={styles.cardTitle}>{card.title}</span>
            <button
              onClick={() => onDeleteCard(card.id)}
              style={styles.deleteBtn}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  inbox: {
    width: 260,
    minWidth: 260,
    background: "#ffffff",
    borderRadius: 8,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  count: {
    background: "#f0f2f5",
    borderRadius: 12,
    padding: "2px 8px",
    fontSize: 12,
    color: "#888",
  },
  addArea: {
    padding: 12,
    borderBottom: "1px solid #eee",
  },
  addForm: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  input: {
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  addFormActions: {
    display: "flex",
    gap: 8,
  },
  addBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: 13,
    cursor: "pointer",
  },
  captureBtn: {
    width: "100%",
    background: "none",
    border: "1px dashed #ddd",
    borderRadius: 6,
    color: "#888",
    padding: "8px 12px",
    fontSize: 13,
    cursor: "pointer",
    textAlign: "left",
  },
  cardList: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    maxHeight: "calc(100vh - 240px)",
  },
  card: {
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: 6,
    padding: "10px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitle: {
    fontSize: 13,
    color: "#333",
    flex: 1,
    lineHeight: 1.4,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#aaa",
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
    flexShrink: 0,
  },
  emptyText: {
    fontSize: 12,
    color: "#aaa",
    fontStyle: "italic",
    textAlign: "center",
    margin: 0,
    padding: "8px 0",
  },
};
