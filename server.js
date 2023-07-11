const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const allNotes = require('./db/db');

function createNewNote(body, notesArray) {
    const newNote = body;
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(_dirname, './db/db.json'),
        JSON.stringify({allNotes: notesArray }, null, 2)
    );
    return newNote;
}

app.get('/api/notes', (req,res) => {
    res.json(allNotes);
});

app.post('api/notes', (req,res) => {
   req.body.id = allNotes.length.toString();

   const newNote = createNewNote(req.body, allNotes);

   res.json(newNote);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});