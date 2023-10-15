import express from "express";
import path from "path";
import { myAuth } from "../frontend/js/auth.js";
import { myDB } from "../db/MyDB.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.redirect("/"); // Redirect to the login page if the user is not logged in
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("req.body:", req.body); // Log the request body

  console.log("req.session:", req.session);

  // Check if the username and password match in your authentication logic

  const isAuthenticated = await myAuth.authenticateUser(username, password);

  if (isAuthenticated) {
    console.log("User is authenticated");
    // Save the username in the session
    req.session.user = username;
    req.session.save();
    res.status(200).send("User logged in successfully");
  } else {
    console.log("User is not authenticated");
    // Display the login form again with an error message
    res.status(400).send("Invalid username or password. Please try again.");
  }
});

// Rigister route

router.get("/register", (req, res) => {
  const __dirname = path.resolve();

  res.sendFile(path.join(__dirname, "/frontend/registration.html"));
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await myAuth.hashPassword(password);

  // Check if the username already exists in the database

  const existingUser = await myDB.getUserByUsername(username);

  if (existingUser) {
    res

      .status(400)

      .send("Username already exists. Please choose a different one.");
  } else {
    // Insert the new user into the database
    await myDB.insertUser(username, hashedPassword);
    console.log("req.session:", req.session);
    res.send("User registered successfully. <a href='/'>Go back to login</a>");
  }
});

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

router.get("/cards", async (req, res) => {
  console.log("req.session:", req.session);
  console.log("hello~~~~~~~~~~~~~~~~~~~~~~~~~~`");
  console.log("req.session.user:", req.session.user);

  if (req.session.user) {
    const username = req.session.user;

    try {
      const cards = await myDB.getCardsByUsername(username);

      res.status(200).json(cards);
    } catch (error) {
      console.error("Error fetching user's cards:", error);

      res.status(500).send("An error occurred while fetching user's cards");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/cards/create", async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.session.user:", req.session.user);

  if (req.session.user) {
    const username = req.session.user;

    const { question, answer } = req.body;
    const card = { question, answer };
    console.log("card", card);

    try {
      await myDB.insertCard(card, username);

      res.send("Card created successfully");
    } catch (error) {
      console.error("Error creating card:", error);

      res.status(500).send("An error occurred while creating the card");
    }
  } else {
    res.redirect("/login");
  }
});

// Default export

export default router;
