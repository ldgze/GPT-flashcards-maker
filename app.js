import { config } from "dotenv"; // Use ES6 modules to import dotenv
config(); // Load environment variables

import express from "express";
import session from "express-session";

import apiRouter from "./routes/api.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

app.use("/api", apiRouter);

app.use(
  session({
    secret: "my_secret_key",
    resave: true,
    saveUninitialized: false,
  }),
);

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.listen(PORT, () => console.log(`First Listening on port ${PORT}`));
