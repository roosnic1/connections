"use client";

import { deleteConnection } from "../_actions/connections";

export default function DeleteButton({
  connectionId,
}: {
  connectionId: number;
}) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this connection?")) {
      return;
    }
    await deleteConnection(connectionId);
  };

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
    >
      Delete
    </button>
  );
}
