import { useState } from "react";

export default function KanbanColumn({
  column,
  onAddCard,
  onDeleteCard,
  onDragStart,
  onCardDrop,
}) {
  const [addingCard, setAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddCard(column.id, { id: `card-${Date.now()}`, title: newTitle.trim() });
    setNewTitle("");
    setAddingCard(false);
  };

  return (
    <div
      style={{
        ...styles.column,
        background: isDragOver ? "#fff5f5" : "#fff",
        outline: isDragOver ? "2px dashed #e74c3c" : "2px solid transparent",
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onCardDrop(column.id);
      }}
    >
      {/* Static title - nothing draggable */}
      <div style={styles.header}>
        <span style={styles.title}>{column.title}</span>
        <span style={styles.count}>{column.cards.length}</span>
      </div>

      <div style={styles.cardList}>
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            colId={column.id}
            onDragStart={onDragStart}
            onDelete={() => onDeleteCard(column.id, card.id)}
          />
        ))}

        {addingCard ? (
          <div style={styles.addForm}>
            <input
              autoFocus
              placeholder="Card title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") {
                  setAddingCard(false);
                  setNewTitle("");
                }
              }}
              style={styles.input}
            />
            <div style={{ display: "flex", gap: 8 }}>
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

function Card({ card, colId, onDragStart, onDelete }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation();
        setTimeout(() => setDragging(true), 0);
        onDragStart(card.id, colId);
      }}
      onDragEnd={() => setDragging(false)}
      style={{
        ...styles.card,
        opacity: dragging ? 0.3 : 1,
        pointerEvents: dragging ? "none" : "auto",
      }}
    >
      <span style={styles.cardTitle}>{card.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={styles.deleteBtn}
      >
        ×
      </button>
    </div>
  );
}

const styles = {
  column: {
    width: 260,
    minWidth: 260,
    borderRadius: 8,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "background 0.15s ease",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "8px 8px 0 0",
    background: "#fff",
  },
  title: { fontWeight: "bold", fontSize: 14, color: "#333" },
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
    minHeight: 80,
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
    cursor: "grab",
    userSelect: "none",
  },
  cardTitle: { fontSize: 13, color: "#333", flex: 1, lineHeight: 1.4 },
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
  addForm: { display: "flex", flexDirection: "column", gap: 8 },
  input: {
    padding: "8px 10px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
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
