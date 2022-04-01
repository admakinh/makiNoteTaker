const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const note = express();

note.use(express.json());
note.use(express.urlencoded({ extended: true }));
note.use(express.static('public'));

note.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes'));
});

note.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

note.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('.db/db.json'));
    const newNote = req.body;
    newNote.id = uuid.v1();
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});

note.delete ('api/notes/:id', (req, res) => {
    let removeId = req.params.id;
    const notes = JSON.parse(fs.readFileSync('.db/db.json'));
    const updateDb = notes.filter(note => note.id !== removeId);

    fs.writeFileSync('.db/db.json', JSON.stringify(updateDb));

res.json(updateDb);
console.log('Req.params:', removeId);
});

note.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

note.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
});