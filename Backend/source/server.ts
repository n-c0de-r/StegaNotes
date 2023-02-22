import "dotenv/config";
import env from "./util/validateEnv";
import mongoose from "mongoose";
import express from "express";

const app = express();
const port = env.PORT;

app.get("/", (request, response) => {
    response.send("Hello World");
});

mongoose.connect(env.MONGO_CONNECTION_STRING)
    .then(() => {
        console.log("Mongoose connected.");
        app.listen(port, () => {
            console.log("Server listening on port: " + port);
        });
    })
    .catch(console.error);
