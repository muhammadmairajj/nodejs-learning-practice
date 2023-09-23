const express = require("express");
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, next) {
      next(null, 'public/uploads/images'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, next) {
      next(null, Date.now() + '-' + file.originalname); // Define the filename
    },
  });
  
// const upload = multer({ dest: 'public/uploads/images' });
const upload = multer({ storage: storage });
const notesRouter = express.Router();
const {
  getNotes,
  getNotesById,
  createNotes,
  updateNotes,
  deleteNotes,
  restictedId,
  createNoteWithImage,
  getNoteUserById
} = require("../controllers/notesController");
const {
  protectedData,
  accessDelete,
} = require("../controllers/authController");


notesRouter.param("id", restictedId);
notesRouter
  .route("/")
  .get(protectedData, getNotes)
//   .post(protectedData, createNotes);
notesRouter.route("/user-notes").get(protectedData, getNoteUserById);
notesRouter.route("/upload-image").post(protectedData, upload.single("image"), createNoteWithImage);
notesRouter
  .route("/:id")
  .get(protectedData, getNotesById)
  .put(protectedData, updateNotes)
  .delete(protectedData, accessDelete("admin"), deleteNotes);

module.exports = notesRouter;
