// Board.jsx
import { useState, useRef } from "react";
import Header from "../components/Header";
import InboxColumn from "../components/InboxColumn";
import KanbanColumn from "../components/KanbanColumn";

const INITIAL_COLUMNS = [
  { id: "col-1", title: "To Do", cards: [] },
  { id: "col-2", title: "In Progress", cards: [] },
  { id: "col-3", title: "Review", cards: [] },
  { id: "col-4", title: "Done", cards: [] },
];

export default function Board({ onLogout }) {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [inboxCards, setInboxCards] = useState([]);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  // Store dragging info in a ref — simple and reliable
  const dragInfo = useRef({ cardId: null, fromColId: null });

  // ── Inbox ────────────────────────────────────────────────
  const addToInbox = (card) => setInboxCards((prev) => [...prev, card]);
  const deleteFromInbox = (cardId) =>
    setInboxCards((prev) => prev.filter((c) => c.id !== cardId));

  // ── Column cards ─────────────────────────────────────────
  const addCardToColumn = (colId, card) =>
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId ? { ...col, cards: [...col.cards, card] } : col
      )
    );

  const deleteCardFromColumn = (colId, cardId) =>
    setColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );

  // ── Called by KanbanCard when drag starts ────────────────
  const handleDragStart = (cardId, fromColId) => {
    dragInfo.current = { cardId, fromColId };
  };

  // ── Called by KanbanColumn when a card is dropped on it ──
  const handleCardDrop = (toColId) => {
    const { cardId, fromColId } = dragInfo.current;

    // Do nothing if dropped on same column or nothing is dragging
    if (!cardId || fromColId === toColId) return;

    setColumns((prev) => {
      // Find the card
      const fromCol = prev.find((c) => c.id === fromColId);
      const card = fromCol?.cards.find((c) => c.id === cardId);
      if (!card) return prev;

      // Remove from old column, add to new column
      return prev.map((col) => {
        if (col.id === fromColId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        if (col.id === toColId) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      });
    });

    // Clear drag info
    dragInfo.current = { cardId: null, fromColId: null };
  };

  // ── Add column ───────────────────────────────────────────
  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns((prev) => [
      ...prev,
      { id: `col-${Date.now()}`, title: newColumnTitle.trim(), cards: [] },
    ]);
    setNewColumnTitle("");
    setShowAddColumn(false);
  };

  return (
    <div style={styles.page}>
      <Header
        boardTitle="Sprint 1"
        onAddColumn={() => setShowAddColumn(true)}
        onLogout={onLogout}
      />

      {showAddColumn && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>New Column</h3>
            <input
              autoFocus
              placeholder="Column title"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddColumn();
                if (e.key === "Escape") setShowAddColumn(false);
              }}
              style={styles.modalInput}
            />
            <div style={styles.modalActions}>
              <button onClick={handleAddColumn} style={styles.modalAddBtn}>
                Add Column
              </button>
              <button
                onClick={() => {
                  setShowAddColumn(false);
                  setNewColumnTitle("");
                }}
                style={styles.modalCancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.board}>
        <InboxColumn
          cards={inboxCards}
          onAddCard={addToInbox}
          onDeleteCard={deleteFromInbox}
        />
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onAddCard={addCardToColumn}
            onDeleteCard={deleteCardFromColumn}
            onDragStart={handleDragStart}
            onCardDrop={handleCardDrop}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f0f2f5",
    overflow: "hidden",
  },
  board: {
    display: "flex",
    gap: 16,
    padding: 24,
    overflowX: "auto",
    flex: 1,
    alignItems: "flex-start",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  modal: {
    background: "#fff",
    borderRadius: 10,
    padding: "28px 32px",
    width: 320,
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  modalTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  modalInput: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    gap: 10,
  },
  modalAddBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "9px 18px",
    fontSize: 13,
    fontWeight: "bold",
    cursor: "pointer",
  },
  modalCancelBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: 13,
    cursor: "pointer",
  },
};
