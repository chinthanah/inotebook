const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route1
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route2 add notes
router.post(
  "/addnotes",
  fetchuser,
  //adding title and description
  [
    body("title", "enter a valid name").isLength({ min: 3 }),
    body("description", "enter a valid email").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      //Schema of Notes
      const { title, description, tag } = req.body;

      //if there are errors returns bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //adding Note details in note
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      //save the notes
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route3 Update existing notes using "api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try{
  const { title, description, tag } = req.body;

  //create a newNote object
  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find the note to be updated and update it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(404).send("not allowed");
  }
  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json({ note });
  }
  catch(error){
    console.error(error.message);
      res.status(500).send("Internal server error");
  }
});

//Route4 Delete existing notes using "api/notes/deletenote".
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  //find the note to be deleted and delete it
  try
  {
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("not found");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(404).send("not allowed");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ Success: "Note has been deleted" });
}
catch(error){
  console.error(error.message);
      res.status(500).send("Internal server error");
}
});

module.exports = router;
