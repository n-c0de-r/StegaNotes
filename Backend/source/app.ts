import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import NoteModel from "./models/note";

const app = express();

app.get("/", async (request, response, next) => {
    try {
        const notes = await NoteModel.find().exec();
        response.status(200).json(notes);
    }
    catch (error) {
        next(error);
    }
});

app.use((request, response, next) => {
    next(Error("Endpoint not found."));
});

//Error handling middleware, using express syntax
app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured.";
    if (error instanceof Error) errorMessage = error.message;
    response.status(500).json({ error: errorMessage });
});

export default app;