const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const NoteModel = require("../models/notesModel");

exports.restictedId = (req, res, next, val) => {
  if (val == 456) {
    return res.send("This id is restriced");
  }
  next();
};

// exports.getNotes = (req, res) => {
//     console.log(req);
//       const notes = JSON.parse(fs.readFileSync(`${__dirname}/../notes.json`));
//     res.status(200).json({ message: "Success", data: notes });
//   };

exports.getNotes = async (req, res) => {
  // const notes = await NoteModel.find();
  // res.status(200).json({ message: "Success", data: notes });
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `${match}`);
    let query = NoteModel.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    } else {
      query = query.sort("-created_at");
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join("");
      query = query.select(fields.toString());
    } else {
      query = query.select("-__v");
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const note = await query;
    res.status(200).json({ message: "Success", data: note });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Error in getting notes from DB." + error,
    });
  }
};

// exports.getNotesById = (req, res) => {
//     const notes = JSON.parse(fs.readFileSync(`${__dirname}/../notes.json`));
//     const noteId = req.params.id;
//     const note = notes.find((note) => note._id === noteId);
//     if (!note)
//       return res
//         .status(400)
//         .json({ message: "Note with this Id doesn't exists" });
//     res.status(200).json({ message: "Success", data: note });
//   };

exports.getNoteUserById = async (req, res) => {
  const userId = req.user._id;
  const note = await NoteModel.find({ user: userId });
  if (!note) {
    return res.status(400).json({
      status: "Failed",
      message: "Unable to fetch the notes by logged in user. Try Again",
    });
  }
  res.status(200).json({ message: "Success", data: note });
};

exports.getNotesById = async (req, res) => {
  const noteId = req.params.id;
  console.log("noteId", noteId);
  const note = await NoteModel.findById(noteId);
  if (!note) {
    return res
      .status(400)
      .json({ message: "Note with this Id doesn't exists" });
  }
  res.status(200).json({ message: "Success", data: note });
};

// exports.targetNotes = async (req, res) => {
//   console.log(req.query);
// }
// exports.createNotes = (req, res) => {
//     const notesId = uuidv4();
//     const notes = JSON.parse(fs.readFileSync(`${__dirname}/../notes.json`));
//     const newNotes = Object.assign({ _id: notesId }, req.body);
//     notes.push(newNotes);

//     fs.writeFile(`${__dirname}/../notes.json`, JSON.stringify(notes), (err) => {
//       if (err) throw err;
//       res.status(201).json({ message: "Success", data: notes });
//     });
//   };

exports.createNotes = async (req, res) => {
  // console.log("req. body:  ", req.body);
  // const newNote = await new NoteModel(req.body);
  // const saveNote = newNote.save();
  const { title, description, priority } = req.body;
  const userId = req.user._id;
  const newNote = await NoteModel.create({
    title,
    description,
    priority,
    user: userId,
  });
  if (newNote) {
    res
      .status(201)
      .json({ message: "New Note is Added", success: true, data: { newNote } });
  } else {
    res.status(400).json({ message: "New Note is not added", success: false });
  }
};

exports.createNoteWithImage = async (req, res) => {
  try {
    const { title, description, priority } = JSON.parse(req.body.jsonData);
    const userId = req.user._id;
    const imagePath = req.file ? req.file.path : null;
    if (!imagePath) {
      return res.status(400).json({
        message: "Image upload failed",
        success: false,
      });
    }

    const newNote = await NoteModel.create({
      title,
      description,
      priority,
      user: userId,
      imagePath,
    });

    res.status(201).json({
      message: "New Note is Added",
      success: true,
      data: { note: newNote },
    });
  } catch (error) {
    // console.error("Error creating a new note with image:", error);
    res.status(500).json({
      message: "Error in creating a new note with image",
      success: false,
    });
  }
};

// exports.updateNotes = (req, res) => {
//     const notes = JSON.parse(fs.readFileSync(`${__dirname}/../notes.json`));
//     const noteId = req.params.id;
//     const updateNote = req.body;
//     const note = notes.find((note) => note._id === noteId);
//     const noteIndex = notes.findIndex((note) => note._id === noteId);
//     if (!note)
//       return res
//         .status(400)
//         .json({ message: "Note with this Id doesn't exists" });
//     for (const [key, value] of Object.entries(updateNote)) {
//       note[key] = value;
//     }

//     notes[noteIndex] = note;
//     fs.writeFile(`${__dirname}/../notes.json`, JSON.stringify(notes), (err) => {
//       if (err) throw err;
//       res.status(201).json({ message: "Success: Note is Updated.", data: notes });
//     });
//   };

exports.updateNotes = async (req, res) => {
  const noteId = req.params.id;
  const { title, description } = req.body;
  const note = await NoteModel.updateOne(
    { _id: noteId },
    { $set: { title, description } },
    { new: true, runValidators: true }
  );
  if (!note) {
    return res.status(404).json({ message: "Note not found." });
  }
  res.status(200).json({ message: "Success: Note is updated.", data: note });
};

// exports.deleteNotes = (req, res) => {
//     const notes = JSON.parse(fs.readFileSync(`${__dirname}/../notes.json`));
//     const noteId = req.params.id;
//     const noteIndex = notes.findIndex((note) => note._id === noteId);
//     if (!noteIndex)
//       return res
//         .status(400)
//         .json({ message: "Note with this Id doesn't exists" });
//     notes.splice(noteIndex, 1);
//     fs.writeFile(`${__dirname}/../notes.json`, JSON.stringify(notes), (err) => {
//       if (err) throw err;
//       res.status(201).json({ message: "Success: Note is Deleted.", data: notes });
//     });
//   };

exports.deleteNotes = async (req, res) => {
  const noteId = req.params.id;
  const note = await NoteModel.deleteOne({ _id: noteId });
  res.status(201).json({ message: "Success: Note is Deleted.", data: note });
};
