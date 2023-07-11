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
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if(notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(_dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.get('/api/notes', (req,res) => {
    res.json(allNotes.slice(1));
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

   const newNote = createNewNote(req.body, allNotes);

   res.json(newNote);
});

function deleteNote(id, notesArray) {
    for(let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
        fs.writeFileSync(
            path.join(_dirname, '.db/db.json'),
            JSON.stringify(notesArray, null, 2)
        );

        break;
        }
    
    }
}

app.delete('/api/notes/:id' , (res,req) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});