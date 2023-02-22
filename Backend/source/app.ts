import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import createHttpError, { isHttpError } from "http-errors";
import notesRouter from "./routes/notes";

const app = express();

app.use(express.json());

app.use("/api/notes/", notesRouter);

app.use((request, response, next) => {
    next(createHttpError(404, "Endpoint not found."));
});

//Error handling middleware, using express syntax
app.use((error: unknown, request: Request, response: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occured.";
    let statusCode = 500; //fallback

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    response.status(500).json({ error: errorMessage });
});

export default app;