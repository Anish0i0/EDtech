import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // tracks which note is loading
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, []);

  // Fetch all notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(res.data.notes);
      } catch {
        setError("Failed to load notes");
      }
    };
    fetchNotes();
  }, []);

  // Generate summary
  const handleSummarize = async (noteId) => {
    setLoadingId(noteId); // show loading on this specific note
    setError("");
    try {
      const res = await axios.post(
        `http://localhost:3000/api/notes/${noteId}/summarize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update notes in state so UI refreshes without page reload
      setNotes((prev) =>
        prev.map((note) =>
          note._id === noteId ? { ...note, summary: res.data.summary } : note,
        ),
      );
    } catch {
      setError("Failed to generate summary");
    } finally {
      setLoadingId(null); // stop loading
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>Hello, {user?.username} 👋</h1>
      <button onClick={handleLogout}>Logout</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>My Notes:</h3>
      {notes.length === 0 && <p>No notes yet</p>}

      {notes.map((note) => (
        <div
          key={note._id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <h4>{note.title}</h4>

          {/* Stretch Goal: show Regenerate if summary exists */}
          {note.summary && note.summary.length > 0 ? (
            <>
              <p>
                <strong>Summary:</strong>
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>{note.summary}</p>
              <button
                onClick={() => handleSummarize(note._id)}
                disabled={loadingId === note._id}
              >
                {loadingId === note._id
                  ? "Generating..."
                  : "Regenerate Summary"}
              </button>
            </>
          ) : (
            <button
              onClick={() => handleSummarize(note._id)}
              disabled={loadingId === note._id}
            >
              {loadingId === note._id ? "Generating..." : "Generate Summary"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
