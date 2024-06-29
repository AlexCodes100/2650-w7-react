import { useState, useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    fetch('http://localhost:3000/notes')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched notes:', data);
        setNotes(data);
      })
      .catch(error => console.error('Error fetching notes:', error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/notes/${id}`, {
      method: 'DELETE',
    })
      .then(() => setNotes(notes.filter(note => note.id !== id)))
      .catch(error => console.error('Error deleting note:', error));
  };

  const handleAdd = () => {
    if (newNote.trim()) {
      fetch('http://localhost:3000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noteText: newNote }),
      })
        .then(response => response.json())
        .then(note => {
          console.log('Added note:', note); 
          fetchNotes();
        })
        .catch(error => console.error('Error adding note:', error));
      setNewNote('');
    }
  };

  return (
    <div className="home">
      <h2>Home</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.text}</Link>
          <button className="delete-button" onClick={() => handleDelete(note.id)}>Delete</button>
        </li>
        ))}
      </ul>
      <div className="add-note">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter a new note"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}

export default Home;
