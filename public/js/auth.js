import bcrypt from "bcrypt";
import { myDB } from "../../db/MyDB.js";

function MyAuth() {
  const myAuth = {};
  myAuth.hashPassword = async (password) => {
    // Generate a salt and hash the password
    const saltRounds = 10; // Number of salt rounds (adjust to your security needs)
    return bcrypt.hash(password, saltRounds);
  };

  myAuth.authenticateUser = async (username, password) => {
    console.log("username:", username);
    const user = await myDB.getUser(username);
    console.log("user:", user);
    const storedHashedPassword = await myDB.getUser(username).password;
    console.log("storedHashedPassword:", storedHashedPassword);
    if (!storedHashedPassword) {
      return false;
    }

    // Compare the entered password with the stored hashed password
    return bcrypt.compare(password, storedHashedPassword);
  };

  return myAuth;
}

export const myAuth = MyAuth();
