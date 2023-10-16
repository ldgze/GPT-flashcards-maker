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
    const user = await myDB.getUserByUsername(username);

    if (!user) {
      return false;
    }
    const storedHashedPassword = await user.password;

    if (!storedHashedPassword) {
      return false;
    }

    // Compare the entered password with the stored hashed password
    return bcrypt.compare(password, storedHashedPassword);
  };

  myAuth.comparePassword = async (username, newHashedPassword) => {
    const user = await myDB.getUserByUsername(username);
    if (!user) {
      return false;
    }
    const storedHashedPassword = await user.password;
    if (!storedHashedPassword) {
      return false;
    }
    // Compare the entered password with the stored hashed password
    console.log("");
    return bcrypt.compare(storedHashedPassword, newHashedPassword);
  };

  return myAuth;
}

export const myAuth = MyAuth();
