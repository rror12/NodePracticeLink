import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notes.css';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editNoteId, setEditNoteId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [openShareId, setOpenShareId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'))?.user;

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.href = "/";
  };

  // Fetch notes from backend (own + shared)
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setNotes(res.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch friends for sharing dropdown
  const fetchFriends = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/friends?currentUserId=${user?._id}`);
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchFriends();
  }, []);

  // Reset input fields
  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditNoteId(null);
  };

  // Save or update note (owner only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!title.trim() && !content.trim()) return;

    try {
      const payload = { title, content };

      if (editNoteId) {
        await axios.put(
          `http://localhost:5000/api/notes/${editNoteId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/notes',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      resetForm();
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // Delete note (owner only)
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Prepare note for editing (owner only)
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditNoteId(note._id);
  };

  // Share note with selected friends (owner only)
  const handleShare = async (noteId, selectedIds) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/notes/${noteId}/share`, {
        shareWithUserIds: selectedIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // alert('Note shared');
      setOpenShareId(null);
    } catch (err) {
      console.error('Error sharing note:', err);
      alert('Failed to share note');
    }
  };

  const isOwner = (note) => String(note.userId) === String(user?._id);

  return (
    <div className="main">
      <header className="header">
        <div className="navbar">
          <div className="logo-container">
            <img src="/favicon.png" alt="Logo" className="logo-img" />
            <h2 className="logo">Inkspire</h2>
          </div>
          <div className="nav-texts">
            <a className="nav-item" href="/friends">Friends</a>
            <a className="nav-item" href="/notification">Notifications</a>
            <a className="nav-item" onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </header>

      {/* Note Form */}
      <form className="create-note" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Take a note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
        />
        <div>
          <button className="add-btn" type="submit">
            {editNoteId ? '✓' : '+'}
          </button>
          {editNoteId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notes.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No notes yet.</p>
        ) : (
          notes.map(note => {
            const owner = isOwner(note);
            const isSharing = openShareId === note._id;
            return (
              <div className="note" key={note._id}>
                <h1>{note.title}</h1>
                <p>{note.content}</p>
                <div className="note-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {owner ? (
                    isSharing ? (
                      // Sharing mode: only show share panel (no edit/delete)
                      <SharePanel
                        friends={friends}
                        onShare={(ids) => handleShare(note._id, ids)}
                        onClose={() => setOpenShareId(null)}
                      />
                    ) : (
                      // Normal mode: show edit/delete and a share icon button
                      <>
                        <button className="edit-btn" onClick={() => handleEdit(note)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(note._id)}>Delete</button>
                        <button
                          type="button"
                          onClick={() => setOpenShareId(note._id)}
                          title="Share"
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            marginLeft: 'auto'
                          }}
                        >
                          <div style={{ position: "relative" }}>
  <img
    src="/share.png"
    alt="Share"
    width="18"
    height="18"
    style={{
      position: "absolute",
      bottom: "68px",
      right: "4px",
      cursor: "pointer"
    }}
  />
</div>
                        </button>
                      </>
                    )
                  ) : (
                    // Shared with you: show only the share indicator icon
                    <img
                      src="/share.png"
                      alt="Shared with you"
                      title="Shared with you"
                      width="18"
                      height="18"
                      style={{ display: 'block', marginLeft: 'auto', marginRight: '10px', opacity: 0.7 }}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function SharePanel({ friends, onShare, onClose }) {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ marginTop: 4, width: '100%' }}>
      <div style={{ marginBottom: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src="/share.png" alt="Share" width="18" height="18"/>
        <span>Share</span>
        <button type="button" onClick={onClose} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }}>Close</button>
      </div>
      <div>
        {friends.length === 0 ? (
          <p style={{ margin: 0 }}>No friends to share with.</p>
        ) : (
          friends.map((f) => (
            <label key={f._id} style={{ display: 'block', marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selected.includes(f._id)}
                onChange={() => toggle(f._id)}
              />
              <span style={{ marginLeft: 8 }}>{f.fname} {f.lname}</span>
            </label>
          ))
        )}
      </div>
      <div style={{ marginTop: 8 }}>
        <button
          type="button"
          onClick={() => onShare(selected)}
          disabled={selected.length === 0}
          style={{
            background: '#f5ba13',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '6px 12px',
            cursor: 'pointer'
          }}
        >
          Share
        </button>
      </div>
    </div>
  );
}

export default Notes;
