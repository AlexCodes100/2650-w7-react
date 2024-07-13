import { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      text
      imageUrl
      imageAuthor
      imageAuthorLink
    }
  }
`;

const ADD_NOTE = gql`
  mutation AddNote($text: String!) {
    addNote(text: $text) {
      id
      text
      imageUrl
      imageAuthor
      imageAuthorLink
    }
  }
`;

const DELETE_NOTE = gql`
  mutation DeleteNote($id: String!) {
    removeNote(id: $id)
  }
`;

function Home() {
  const { loading, error, data, refetch } = useQuery(GET_NOTES);
  const [addNote] = useMutation(ADD_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);

  const [newNote, setNewNote] = useState('');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching notes: {error.message}</p>;

  const handleAdd = () => {
    if (newNote.trim()) {
      addNote({
        variables: { text: newNote },
        onCompleted: () => {
          setNewNote('');
          refetch();
        }
      });
    }
  };

  const handleDelete = (id) => {
    deleteNote({
      variables: { id },
      onCompleted: () => {
        refetch();
      }
    });
  };

  return (
    <div className="home">
      <h2>Home</h2>
      <ul>
        {data.notes.map((note) => (
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
