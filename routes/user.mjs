import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import helmet from "helmet";
import Joi from "joi";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

router.use(helmet()); // Use helmet

// Specifically set the X-Frame-Options header to DENY or SAMEORIGIN
router.use(helmet.frameguard({ action: "deny" }));

//Sign up
router.post("/signup", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newDocument = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      idNumber: req.body.idNumber,
      accountNumber: req.body.accountNumber,
      password: hashedPassword,
      username: `${req.body.firstName}${req.body.lastName}`, // Combine first and last name for the username
    };

    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);

    console.log("User registered with username:", newDocument.username);
    res.status(201).send(result); // Return a success response
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

//Login
router.post("/login", bruteforce.prevent, async (req, res) => {
  const { username, accountNumber, password } = req.body;
  console.log("Login attempt by:", username, accountNumber);

  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ username, accountNumber });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed 🚨" });
    }

    // Compare the provided password with the database password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed 🚨" });
    } else {
      // Authentication successful
      const token = jwt.sign(
        { username: user.username, accountNumber: user.accountNumber },
        "this_secret_should_be_longer_than_it_is",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Authentication successful ✅",
        token: token,
        username: user.username,
      });
      console.log("New token issued:", token);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed 🚫" });
  }
});

export default router;
