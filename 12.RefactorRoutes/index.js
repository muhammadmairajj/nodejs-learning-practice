const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

const getNotes = (req, res) => {
  const notes = JSON.parse(fs.readFileSync(`${__dirname}/notes.json`));
  res.status(200).json({ message: "Success", data: notes });
};

const getNotesById = (req, res) => {
  const notes = JSON.parse(fs.readFileSync(`${__dirname}/notes.json`));
  const noteId = req.params.id;
  const note = notes.find((note) => note._id === noteId);
  if (!note)
    return res
      .status(400)
      .json({ message: "Note with this Id doesn't exists" });
  res.status(200).json({ message: "Success", data: note });
};

const createNotes = (req, res) => {
  const notesId = uuidv4();
  // console.log(req.body);
  const notes = JSON.parse(fs.readFileSync(`${__dirname}/notes.json`));
  const newNotes = Object.assign({ _id: notesId }, req.body);
  // console.log(notes);
  notes.push(newNotes);

  fs.writeFile(`${__dirname}/notes.json`, JSON.stringify(notes), (err) => {
    if (err) throw err;
    res.status(201).json({ message: "Success", data: notes });
  });
};

const updateNotes = (req, res) => {
  const notes = JSON.parse(fs.readFileSync(`${__dirname}/notes.json`));
  const noteId = req.params.id;
  const updateNote = req.body;
  const note = notes.find((note) => note._id === noteId);
  const noteIndex = notes.findIndex((note) => note._id === noteId);
  if (!note)
    return res
      .status(400)
      .json({ message: "Note with this Id doesn't exists" });
  for (const [key, value] of Object.entries(updateNote)) {
    note[key] = value;
  }

  notes[noteIndex] = note;
  fs.writeFile(`${__dirname}/notes.json`, JSON.stringify(notes), (err) => {
    if (err) throw err;
    res.status(201).json({ message: "Success: Note is Updated.", data: notes });
  });
};

const deleteNotes = (req, res) => {
  const notes = JSON.parse(fs.readFileSync(`${__dirname}/notes.json`));
  const noteId = req.params.id;
  const noteIndex = notes.findIndex((note) => note._id === noteId);
  if (!noteIndex)
    return res
      .status(400)
      .json({ message: "Note with this Id doesn't exists" });
  notes.splice(noteIndex, 1);
  fs.writeFile(`${__dirname}/notes.json`, JSON.stringify(notes), (err) => {
    if (err) throw err;
    res.status(201).json({ message: "Success: Note is Deleted.", data: notes });
  });
};

app.route("/api/notes").get(getNotes).post(createNotes);
app.route("/api/notes/:id").get(getNotesById).put(updateNotes).delete(deleteNotes)
// app.get("/api/notes", getNotes);
// app.post("/api/notes", createNotes);
// app.get("/api/notes/:id", getNotesById);
// app.put("/api/notes/:id", updateNotes);
// app.delete("/api/notes/:id", deleteNotes);

app.listen(PORT, "localhost", () => {
  console.log(`server is running on at port: ${PORT}`);
});
