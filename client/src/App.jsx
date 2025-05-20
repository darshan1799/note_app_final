import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch("http://localhost:5000/notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      setMessage("Error fetching notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setForm({ title: "", description: "" });
      setMessage("Note added successfully!");
      fetchNotes();
    } catch {
      setMessage("Failed to add note");
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/notes/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setMessage("Note deleted");
      fetchNotes();
    } catch {
      setMessage("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">📝 Simple Notes App</h1>
        {message && <div className="mb-4 text-green-600">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            className="w-full p-2 border rounded"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Note
          </button>
        </form>

        <div className="mt-6">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border p-4 mb-4 rounded bg-gray-50 relative"
            >
              <h2 className="font-semibold">{note.title}</h2>
              <p>{note.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(note.timestamp).toLocaleString()}
              </p>
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
