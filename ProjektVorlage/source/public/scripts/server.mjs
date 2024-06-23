import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

let notes = [];

app.use(cors());
app.use(bodyParser.json());

app.get('/notes', (req, res) => {
    res.json(notes);
});

app.post('/notes', (req, res) => {
    const note = req.body;
    notes.push(note);
    res.status(201).json(note);
});

app.put('/notes/:index', (req, res) => {
    const { index } = req.params;
    const updatedNote = req.body;
    notes[index] = updatedNote;
    res.json(updatedNote);
});

app.delete('/notes/:index', (req, res) => {
    const { index } = req.params;
    notes.splice(index, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
