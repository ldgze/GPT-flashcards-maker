import express from "express";
import { myAuth } from "../frontend/js/auth.js";
import { myDB } from "../db/MyDB.js";
import { myGenerate } from "../frontend/js/generate.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await myDB.getUserByUsername(username);

  if (!existingUser) {
    res.status(400).send("Invalid username. Please register first.");
  } else {
    const isAuthenticated = await myAuth.authenticateUser(username, password);

    if (isAuthenticated) {
      req.session.user = username;
      req.session.save();
      res.status(200).send("User logged in successfully");
    } else {
      res.status(400).send("Invalid password. Please try again.");
    }
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await myAuth.hashPassword(password);

  const existingUser = await myDB.getUserByUsername(username);

  if (existingUser) {
    res
      .status(400)
      .send("Username already exists. Please choose a different one.");
  } else {
    await myDB.insertUser(username, hashedPassword);
    res.status(200).send("User created successfully");
  }
});

router.post("/user/update", async (req, res) => {
  if (req.session.user) {
    const username = req.session.user;
    const newUsername = req.body.username;
    const newPassword = req.body.password;

    if (username === newUsername) {
      const newHashedPassword = await myAuth.hashPassword(newPassword);
      console.log("newPassword", newPassword);
      console.log("newHashedPassword", newHashedPassword);
      const isAuthenticated = await myAuth.authenticateUser(
        username,
        newHashedPassword,
      );
      if (isAuthenticated) {
        return res
          .status(400)
          .send("Password unchanged. Please choose a different password.");
      }

      try {
        await myDB.updateUserByUsername(
          username,
          newUsername,
          newHashedPassword,
        );

        return res.status(200).send("User updated successfully");
      } catch (error) {
        console.error("Error updating user:", error);
        return res
          .status(500)
          .send("An error occurred while updating the user");
      }
    }

    const existingUser = await myDB.getUserByUsername(newUsername);

    if (existingUser) {
      return res
        .status(400)
        .send("Username already exists. Please choose a different one.");
    } else {
      const { password } = req.body;

      const hashedPassword = await myAuth.hashPassword(password);

      try {
        await myDB.updateUserByUsername(username, newUsername, hashedPassword);

        return res.status(200).send("User updated successfully");
      } catch (error) {
        console.error("Error updating user:", error);
        return res
          .status(500)
          .send("An error occurred while updating the user");
      }
    }
  } else {
    res.redirect("/login");
  }
});

router.delete("/user/delete", async (req, res) => {
  if (req.session.user) {
    console.log("delete user...........");
    const username = req.session.user;
    try {
      await myDB.deleteUserByUsername(username);

      res.send("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("An error occurred while deleting the user");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/cards", async (req, res) => {
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
  if (req.session.user) {
    const username = req.session.user;

    const { question, answer } = req.body;
    const card = { question, answer };

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

router.delete("/cards/delete", async (req, res) => {
  if (req.session.user) {
    const _id = req.body;

    try {
      await myDB.deleteCardByID(_id);

      res.send("Card deleted successfully");
    } catch (error) {
      console.error("Error deleting card:", error);

      res.status(500).send("An error occurred while deleting the card");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/cards/update", async (req, res) => {
  if (req.session.user) {
    const { _id, question, answer } = req.body;
    const card = { _id, question, answer };

    try {
      const existingCard = await myDB.getCardByID(_id);

      if (
        existingCard.question === question &&
        existingCard.answer === answer
      ) {
        return res
          .status(400)
          .send(
            "Card unchanged. Please choose a different question or answer.",
          );
      }

      await myDB.updateCardByID(card);

      res.send("Card updated successfully");
    } catch (error) {
      console.error("Error updating card:", error);

      res.status(500).send("An error occurred while updating the card");
    }
  } else {
    res.redirect("/login");
  }
});

router.post("/cards/generate", async (req, res) => {
  if (req.session.user) {
    const text = req.body;

    if (!text) {
      res
        .status(400)
        .send("Please provide valid text for flashcard generation.");
      return;
    }

    try {
      const generatedFlashcards = await myGenerate.generate({ text, res });

      await myDB.insertCard(generatedFlashcards, req.session.user);

      res.status(200).send("Flashcards generated and stored successfully.");
    } catch (error) {
      console.error("Error generating card:", error);

      res.status(500).send("An error occurred while generating the card");
    }
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

export default router;
