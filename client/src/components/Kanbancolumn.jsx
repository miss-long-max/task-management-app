// KanbanColumn.jsx
import { useState } from "react";

export default function KanbanColumn({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onAddCard,
  onDeleteCard,
}) {
  const [addingCard, setAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddCard(column.id, {
      id: `card-${Date.now()}`,
      title: newTitle.trim(),
      description: "",
    });
    setNewTitle("");
    setAddingCard(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setAddingCard(false);
      setNewTitle("");
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
        border: isDragOver ? "2px dashed #e74c3c" : "2px solid transparent",
      }}
    >
      {/* Column header */}
      <div style={styles.header}>
        <span style={styles.title}>{column.title}</span>
        <span style={styles.count}>{column.cards.length}</span>
      </div>

      {/* Cards */}
      <div style={styles.cardList}>
        {column.cards.map((card) => (
          <div key={card.id} style={styles.card}>
            <span style={styles.cardTitle}>{card.title}</span>
            <button
              onClick={() => onDeleteCard(column.id, card.id)}
              style={styles.deleteBtn}
            >
              ×
            </button>
          </div>
        ))}

        {/* Add card */}
        {addingCard ? (
          <div style={styles.addForm}>
            <input
              autoFocus
              placeholder="Card title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />
            <div style={styles.addFormActions}>
              <button onClick={handleAdd} style={styles.addBtn}>
                Add
              </button>
              <button
                onClick={() => {
                  setAddingCard(false);
                  setNewTitle("");
                }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingCard(true)} style={styles.addCardBtn}>
            + Add a card
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  column: {
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
  cardList: {
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflowY: "auto",
    maxHeight: "calc(100vh - 200px)",
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
  addCardBtn: {
    background: "none",
    border: "1px dashed #ddd",
    borderRadius: 6,
    color: "#888",
    padding: "8px 12px",
    fontSize: 13,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
};
