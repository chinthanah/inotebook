const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//add notes
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

module.exports = router;
