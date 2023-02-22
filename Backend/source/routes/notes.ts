import express from "express";
import * as NotesController from "../controllers/notes";

const router = express.Router();

router.get("/", NotesController.getNotes);

router.get("/:noteID", NotesController.getNote);

router.post("/", NotesController.createNote);

router.patch("/:noteID", NotesController.updateNote);

router.delete("/:noteID", NotesController.deleteNote);

export default router;