import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/api.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

app.use(cookieParser());

app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: true,
  }),
);

// Serve static files from the 'frontend' directory
app.use(express.static("frontend"));
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`First Listening on port ${PORT}`));
