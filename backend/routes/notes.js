import express from 'express';
import { addNote } from '../persistence.js';
import { removeNote } from '../persistence.js';
import { updateNote } from '../persistence.js';
import { getNotes } from '../persistence.js';
import { getNote } from '../persistence.js';

const router = express.Router();

router.post('/', (req, res) => {
    console.log(req.body);
    const { noteText } = req.body; 
    if (!noteText) {
        res.status(400).send({ error: 'Note text is required' });
        return;
    }
    const note = { text: noteText };
    addNote(note);
    res.status(201).send(note);
});

router.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    const result = removeNote(noteId);
    res.status(200).send({ message: 'Note deleted successfully' });
});

router.put('/:id', (req, res) => {
    const noteId = req.params.id;
    const { text, imageUrl, imageAuthor, imageAuthorLink } = req.body;
    console.log('Updating note with ID:', noteId);
    const updatedNote = updateNote(noteId, text, imageUrl, imageAuthor, imageAuthorLink);
    res.status(200).send(updatedNote);
});

router.get('/', (req, res) => {
    const notes = getNotes();
    res.status(200).json(notes);
});

router.get('/:id', (req, res) => {
    const noteId = req.params.id;
    const note = getNote(noteId);
    if (!note) {
        res.status(404).send({ error: 'Note not found' });
        return;
    }
    res.status(200).send(note);
});

router.get('/unsplash/:query', async (req, res) => {
    const query = req.params.query;
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${accessKey}`);
      const data = await response.json();
      res.status(200).send(data);
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      res.status(500).send({ error: 'Error fetching image from Unsplash' });
    }
  });

export default router;