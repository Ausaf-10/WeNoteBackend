const express = require("express");
const router = express.Router();
const notesModel = require("../models/notes");
const fetchUsers = require("../Middleware/fetchUser");

router.post("/addNote", fetchUsers, (req, res) => {
  if (req.body.success) {
    const note = {
      title: req.body.title,
      description: req.body.description,
      userId: req.body.user.id,
      tag: (req.body.tag==='') ? "General" : req.body.tag,
    };
    notesModel
      .create(note)
      .then((an) => {
        res.send({ Msg: "Notes created successfully",success:true,Note:an });
      })
      .catch((err) => {
        res.status(501).send({ Msg: "System Error",sucess:false });
      });
  } else res.status(404).send("You must be logged in to use this service");
});

router.get("/getNote", fetchUsers, async (req, res) => {
  if (req.body.success) {
    try {
      const a = await notesModel.find({ userId: req.body.user.id });
      res.send(a);
    } catch (err) {
      res.status(501).send("Internal Server Error");
    }
  } else res.status(404).send("You must be logged in to use this service");
});

router.put("/updateNote/:ID", fetchUsers, (req, res) => {
  if (req.body.success) {
    // Creating Note to replace with
    const updatedNote = {};
    if (req.body.title) updatedNote.title = req.body.title;
    if (req.body.tag) updatedNote.tag = req.body.tag;
    if (req.body.description) updatedNote.description = req.body.description;

    //Finding for valid previous version of note
    notesModel
      .findById(req.params.ID)
      .then(async (a) => {
        //User is not valid or accessing someone's other note
        if (a.userId != req.body.user.id) res.status(404).send("Invalid User");
        else {
          try {
            un = await notesModel.findByIdAndUpdate(a.id, updatedNote);
            await un.save();
            note = await notesModel.findById(a.id);
            res.send({ Msg: "Notes Updated successfully", Note: note });
          } catch (error) {
            res.status(501).send("Internal Server Error");
          }
        }
      })
      .catch(() => {
        //Not Found any valid note
        res.status(404).send("No such Note Found");
      });
  } else {
    res.status(404).send("You must be logged in to use this service");
  }
});

router.delete("/deleteNote/:ID", fetchUsers, (req, res) => {
  if (req.body.success) {
    //Finding for valid previous version of note
    notesModel
      .findById(req.params.ID)
      .then(async (a) => {
        //User is not valid or accessing someone's other note
        if (a.userId != req.body.user.id) res.status(404).send("Invalid User");
        else {
          try {
            dn = await notesModel.findByIdAndDelete(a.id);
            res.send({ Msg: "Notes Updated successfully", Note: dn });
          } catch (error) {
            res.status(501).send("Internal Server Error");
          }
        }
      })
      .catch(() => {
        //Not Found any valid note
        res.status(404).send("No such Note Found");
      });
  } else {
    res.status(404).send("You must be logged in to use this service");
  }
});

module.exports = router;
