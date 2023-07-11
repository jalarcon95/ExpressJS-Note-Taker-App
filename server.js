const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const allNotes = require('./db/db.json');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body, notesArray) {
    const newNote = body;
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(_dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.get('/api/notes', (req,res) => {
    res.json(allNotes);
});

app.get('/', (req,res) => {
    res.sendFile(path.join(_dirname, './public/index.html'));
});

app.get('/notes', (req,res) => {
    res.sendFile(path.join(_dirname, './public/notes.html'));
});

app.get('*', (req,res) => {
    res.sendFile(path.join(_dirname, './public/notes.html'));
});

app.post('api/notes', (req,res) => {
   req.body.id = allNotes.length.toString();

   const newNote = createNewNote(req.body, allNotes);

   res.json(newNote);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});