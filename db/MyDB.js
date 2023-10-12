import { MongoClient } from "mongodb";

function MyDB() {
  const uri = "mongodb://localhost:27017" || process.env.MONGODB_URI;
  const myDB = {};

  const prompts = [1, 2, 3, 4];

  const connect = () => {
    const client = new MongoClient(uri);
    const db = client.db("flashcardsMaker");

    return { client, db };
  };

  myDB.getUser = async (username) => {
    const { client, db } = connect();

    const usersCollection = db.collection("users");

    try {
      return await usersCollection.findOne({ username });
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.createUser = async (username, hashedPassword) => {
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

  myDB.getPrompts = async () => {
    try {
      return prompts;
    } finally {
      console.log("db closing connection");
    }
  };

  myDB.getCards = async ({ query = {}, MaxElements } = {}) => {
    const { client, db } = connect();

    const cardsCollection = db.collection("cards");

    try {
      return await cardsCollection.find(query).limit(MaxElements).toArray();
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.createCard = async (card) => {
    const { client, db } = connect();

    const cardsCollection = db.collection("cards");

    try {
      const result = await cardsCollection.insertOne(card);
      return result.ops[0];
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.updateCard = async (id, card) => {
    const { client, db } = connect();

    const cardsCollection = db.collection("cards");

    try {
      const result = await cardsCollection.findOneAndUpdate(
        { _id: id },
        { $set: card },
        { returnOriginal: false },
      );
      return result.value;
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  myDB.deleteCard = async (id) => {
    const { client, db } = connect();

    const cardsCollection = db.collection("cards");

    try {
      const result = await cardsCollection.findOneAndDelete({ _id: id });
      return result.value;
    } finally {
      console.log("db closing connection");
      client.close();
    }
  };

  return myDB;
}

export const myDB = MyDB();
