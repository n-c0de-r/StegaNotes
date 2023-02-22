import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (request, response) => {
    response.send("Hello World");
});

export default app;