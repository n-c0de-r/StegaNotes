import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";

export const getNotes: RequestHandler = async (request, response, next) => {
    try {
        const notes = await NoteModel.find().exec();
        response.status(200).json(notes);
    }
    catch (error) {
        next(error);
    }
}

export const getNote: RequestHandler = async (request, response, next) => {
    const noteID = request.params.noteID;

    try {
        if(!mongoose.isValidObjectId(noteID)){
            throw createHttpError(400, "Invalid Node ID.");
        }

        const note = await NoteModel.findById(noteID).exec();

        if(!note) {
            throw createHttpError(404, "Note note found.")
        }

        // Request ok
        response.status(200).json(note);
    }
    catch (error) {
        next(error);
    }
}

export const createNote: RequestHandler<unknown, unknown, NoteBody, unknown> = async (request, response, next) => {
    const newTitle = request.body.title;
    const newText = request.body.text;

    try {

        if(!newTitle) {
            // bad request
            throw createHttpError(400, "Notes must have a title");
        }

        const newNote = await NoteModel.create({
            title: newTitle,
            text: newText,
        });
        
        // Resource created
        response.status(201).json(newNote);
    }
    catch (error) {
        next(error);
    }
};

export const updateNote: RequestHandler<UpdateNoteParams, unknown, NoteBody, unknown> = async (request, response, next) => {
    //@TODO: Too much code duplication, I don't like it... it's a mix of get & create, can be called???
    const noteID = request.params.noteID;
    const newTitle = request.body.title;
    const newText = request.body.text;

    try {
        if(!mongoose.isValidObjectId(noteID)){
            throw createHttpError(400, "Invalid Node ID.");
        }

        if(!newTitle) {
            // bad request
            throw createHttpError(400, "Notes must have a title");
        }

        const note = await NoteModel.findById(noteID).exec();

        if(!note) {
            throw createHttpError(404, "Note note found.")
        }

        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();

        response.status(200).json(updatedNote);
    }
    catch (error) {
        next(error);
    }
};

export const deleteNote: RequestHandler<UpdateNoteParams, unknown, NoteBody, unknown> = async (request, response, next) => {
    const noteID = request.params.noteID;

    try {
        if(!mongoose.isValidObjectId(noteID)){
            throw createHttpError(400, "Invalid Node ID.");
        }

        const note = await NoteModel.findById(noteID).exec();

        if(!note) {
            throw createHttpError(404, "Note note found.")
        }

        await note.remove();

        response.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
};

interface NoteBody {
    title?: string,
    text?: string,
}

interface UpdateNoteParams {
    noteID: string,
}