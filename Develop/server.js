const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      res.status(500).send({ error: 'Error reading db.json file' });
    } else {
      const notes = JSON.parse(data);
      res.status(200).send(notes);
    }
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      res.status(500).send({ error: 'Error reading db.json file' });
    } else {
      const notes = JSON.parse(data);
      const newNote = req.body;
      newNote.id = notes.length + 1;
      notes.push(newNote);
      fs.writeFile('db.json', JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).send({ error: 'Error writing to db.json file' });
        } else {
          res.status(200).send(newNote);
        }
      });
    }
  });
});


app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('db.json', (err, data) => {
    if (err) {
      res.status(500).send({ error: 'Error reading db.json file' });
    } else {
      let notes = JSON.parse(data);
      notes = notes.filter(note => note.id !== Number(req.params.id));
      console.log(notes);
      fs.writeFile('db.json', JSON.stringify(notes), (err) => {
        if (err) {
          res.status(500).send({ error: 'Error writing to db.json file' });
        } else {
          res.send('Note deleted');
        }
      });
    }
  });
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
