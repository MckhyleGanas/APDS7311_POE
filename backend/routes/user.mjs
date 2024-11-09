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

router.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Unsafe-inline should be avoided if possible
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Joi Schema for input validation
const schema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "First name must be alphabetic.",
    }),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "Last name must be alphabetic.",
    }),
  idNumber: Joi.string()
    .pattern(/^[0-9]{11,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "ID number must be numeric and at least 11 digits.",
    }),
  accountNumber: Joi.string()
    .pattern(/^[0-9]{10,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Account number must be numeric and at least 10 digits.",
    }),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters, including letters, numbers, and special characters.",
    }),
});

// Sign up route with validation
router.post("/signup", async (req, res) => {
  // Validate user input using Joi schema
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user document
    let newDocument = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      idNumber: req.body.idNumber,
      accountNumber: req.body.accountNumber,
      password: hashedPassword,
      username: `${req.body.firstName}${req.body.lastName}`,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);

    console.log("User registered with username:", newDocument.username);
    res.status(201).send(result); // Return a success response
  } catch (errors) {
    console.error("Signup error:", errors);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login route with brute-force protection
router.post("/login", bruteforce.prevent, async (req, res) => {
  const { username, accountNumber, password } = req.body;
  console.log("Login attempt by:", username, accountNumber);

  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ username, accountNumber });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Login failed 🚨\nUser does not exist" });
    }

    // Compare the provided password with the database password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Login failed 🚨\nPassword is incorrect" });
    } else {
      // Authentication successful
      const token = jwt.sign(
        { username: user.username, accountNumber: user.accountNumber },
        "this_secret_should_be_longer_than_it_is",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login Successful ✅",
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
