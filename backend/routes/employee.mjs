import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import helmet from "helmet";
import Joi from "joi";

const router = express.Router();

let store = new ExpressBrute.MemoryStore();
let bruteforce = new ExpressBrute(store);

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
  email: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base": "Last name must be alphabetic.",
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
      email: req.body.email,
      password: hashedPassword,
    };
    let collection = await db.collection("employees");
    let result = await collection.insertOne(newDocument);

    console.log("Employee registered:", newDocument.email);
    res.status(201).send(result); // Return a success response
  } catch (errors) {
    console.error("Signup error:", errors);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login route with brute-force protection
router.post("/login", bruteforce.prevent, async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt by:", email);

  try {
    const collection = await db.collection("employees");
    const user = await collection.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Login failed 🚨 Employee does not exist" });
    }

    // Compare the provided password with the database password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Login failed 🚨 Password is incorrect" });
    } else {
      // Authentication successful
      const token = jwt.sign(
        { email: user.email },
        "this_secret_should_be_shorter_than_it_is",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login Successful ✅",
        token: token,
        email: user.email,
      });
      console.log("New token issued:", token);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed 🚫" });
  }
});

export default router;
