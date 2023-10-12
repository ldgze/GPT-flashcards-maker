import express from "express";
import path from "path";
import { myAuth } from "../public/js/auth.js";

import { myDB } from "../db/MyDB.js";

// Named export
const router = express.Router();

// Registration route
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await myAuth.hashPassword(password);

  // Check if the username already exists in the database
  const existingUser = await myDB.getUser(username);

  if (existingUser) {
    res
      .status(400)
      .send("Username already exists. Please choose a different one.");
  } else {
    // Insert the new user into the database
    await myDB.createUser(username, hashedPassword);
    res.send("User registered successfully. <a href='/'>Go back to login</a>");
  }
});

router.get("/prompts", async (req, res) => {
  console.log("should return prompts");

  console.log("before");
  const prompts = await myDB.getPrompts();
  console.log("after");

  res.json(prompts);
});

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("req.body:", req.body); // Log the request body

  // Check if the username and password match in your authentication logic
  const isAuthenticated = await myAuth.authenticateUser(username, password);

  if (isAuthenticated) {
    console.log("User is authenticated");
    // Redirect to the dashboard on successful login
    res.redirect("/dashboard");
  } else {
    console.log("User is not authenticated");
    // Display the login form again with an error message
    const __dirname = path.resolve();
    res.sendFile(path.join(__dirname, "/public/index.html"));
  }
});

// Rigister route
router.get("/register", (req, res) => {
  const __dirname = path.resolve();
  res.sendFile(path.join(__dirname, "/public/registration.html"));
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await myAuth.hashPassword(password);

  const client = await myDB.connect();
  // Check if the username already exists in the database
  const existingUser = await myDB.getUser(username);

  if (existingUser) {
    res
      .status(400)
      .send("Username already exists. Please choose a different one.");
  } else {
    // Insert the new user into the database
    await myDB.createUser(username, hashedPassword);
    res.send("User registered successfully. <a href='/'>Go back to login</a>");
  }

  client.close(); // Close the database connection
});

// Default export
export default router;
