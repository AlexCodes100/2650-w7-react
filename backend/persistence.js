import { v4 as uuidv4 } from "uuid";

let _notes = [
  { id: uuidv4(), text: "CPSC 2650", imageUrl: '', imageAuthor: '', imageAuthorLink: '' },
  { id: uuidv4(), text: "An awesome web dev Note", imageUrl: '', imageAuthor: '', imageAuthorLink: '' },
];

// TODO: implement addNote and removeNote
// For fun: why do we export a function instead of notes directly?
const notes = () => _notes;

// Add a note
const addNote = (note) => {
  const newNote = {
    id: uuidv4(),
    text: note.text,
    imageUrl: '',
    imageAuthor: '',
    imageAuthorLink: ''
  };
  _notes.push(newNote);
  return newNote;
};

// Remove a note
const removeNote = (id) => {
    _notes = _notes.filter(note => note.id !== id);
    console.log(_notes);
};

// Update a note
const updateNote = (id, newText, imageUrl = '', imageAuthor = '', imageAuthorLink = '') => {
  _notes = _notes.map(note => note.id === id ? { ...note, text: newText, imageUrl, imageAuthor, imageAuthorLink } : note);
  return _notes.find(note => note.id === id);
};

// Retrieve all notes
const getNotes = () => _notes;

// Retrieve one note
const getNote = (id) => _notes.find(note => note.id === id);

export { notes, addNote, removeNote, updateNote, getNotes, getNote};
