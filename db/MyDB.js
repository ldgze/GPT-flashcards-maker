import "dotenv/config"; // to load .env file
import { MongoClient, ObjectId } from "mongodb";

function MyDB() {
  const uri = "mongodb://localhost:27017" || process.env.MONGODB_URI;
  const myDB = {};

  const connect = () => {
    console.log("Connecting to", uri.slice(0, 20));
    const client = new MongoClient(uri);
    const db = client.db("flashcardsMaker");

    return { client, db };
  };

  myDB.getCardsByUsername = async (username) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");

    try {
      const queryObj = {
        "user.username": username,
      };
      return await cardsCollection.find(queryObj).toArray();
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.insertCard = async (card, username) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const user = await myDB.getUserByUsername(username);
    const createdate = new Date();
    console.log("card:", card);

    try {
      await cardsCollection.insertOne({
        question: card.question,
        answer: card.answer,
        createdate: createdate,
        user: user,
      });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.insertManyCards = async (cards, username) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const user = await myDB.getUserByUsername(username);
    const createdate = new Date();
    console.log("cards:", cards);
    try {
      await cardsCollection.insertMany(
        cards.map((card) => ({
          question: card.question,
          answer: card.answer,
          createdate: createdate,
          user: user,
        })),
      );
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.deleteCardByID = async (card_id) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const queryObj = {
      _id: new ObjectId(card_id),
    };

    try {
      await cardsCollection.deleteOne(queryObj);
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getCardByID = async (card_id) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    const queryObj = {
      _id: new ObjectId(card_id),
    };
    try {
      return await cardsCollection.findOne(queryObj);
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.updateCardByID = async (card) => {
    const { client, db } = connect();
    const cardsCollection = db.collection("cards");
    console.log("hello card:", card);
    const filter = {
      _id: new ObjectId(card._id),
    };
    const update = { $set: { question: card.question, answer: card.answer } };

    try {
      const result = await cardsCollection.updateOne(filter, update);

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully");
      } else if (result.matchedCount === 0) {
        throw new Error("Document not found");
      } else {
        throw new Error("Document found but not updated");
      }
    } catch (err) {
      console.error("Error updating card:", err);
      throw err; // Re-throw the error to be caught by the caller
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.insertUser = async (username, hashedPassword) => {
    const { client, db } = connect();
    const usersCollection = db.collection("users");

    try {
      await usersCollection.insertOne({
        username,
        password: hashedPassword,
      });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getUserByUsername = async (username) => {
    const { client, db } = connect();

    const usersCollection = db.collection("users");

    try {
      return await usersCollection.findOne({ username });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.updateUser = async (user) => {
    const { client, db } = connect();

    const usersCollection = db.collection("users");

    try {
      const result = await usersCollection.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { returnOriginal: false },
      );
      return result.value;
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.getUserCollection = () => {
    const { client, db } = connect();
    const usersCollection = db.collection("users");

    try {
      return usersCollection;
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  return myDB;
}

export const myDB = MyDB();
