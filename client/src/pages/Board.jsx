// Board.jsx — sketch of how to compose these components
import { useState, useRef } from "react";
import Header from "../components/Header";
import InboxColumn from "../components/InboxColumn";
import KanbanColumn from "../components/KanbanColumn";

const INITIAL_COLUMNS = [
  { id: "col-1", title: "To Do", color: "blue", cards: [] },
  { id: "col-2", title: "In Progress", color: "yellow", cards: [] },
  { id: "col-3", title: "Review", color: "purple", cards: [] },
  { id: "col-4", title: "Done", color: "green", cards: [] },
];

export default function Board() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [inboxCards, setInboxCards] = useState([]);
  const dragColId = useRef(null);

  const addToInbox = (card) => setInboxCards((prev) => [...prev, card]);
  const deleteFromInbox = (cardId) =>
    setInboxCards((prev) => prev.filter((c) => c.id !== cardId));

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

  const handleDragStart = (e, colId) => {
    dragColId.current = colId;
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetColId) => {
    if (!dragColId.current || dragColId.current === targetColId) return;
    setColumns((prev) => {
      const cols = [...prev];
      const fromIdx = cols.findIndex((c) => c.id === dragColId.current);
      const toIdx = cols.findIndex((c) => c.id === targetColId);
      const [moved] = cols.splice(fromIdx, 1);
      cols.splice(toIdx, 0, moved);
      return cols;
    });
    dragColId.current = null;
  };

  const addColumn = () => {
    const id = `col-${Date.now()}`;
    setColumns((prev) => [
      ...prev,
      { id, title: "New Column", color: "slate", cards: [] },
    ]);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a1a",
      }}
    >
      <Header boardTitle="Sprint 1" onAddColumn={addColumn} />
      <div
        style={{
          display: "flex",
          gap: 16,
          padding: 24,
          overflowX: "auto",
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        <InboxColumn
          cards={inboxCards}
          onAddCard={addToInbox}
          onDeleteCard={deleteFromInbox}
        />
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAddCard={addCardToColumn}
            onDeleteCard={deleteCardFromColumn}
          />
        ))}
      </div>
    </div>
  );
}
