import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import checkauth from "../check-auth.mjs";

const router = express.Router();

// Regular expressions for whitelisting
const userRegex = /^[A-Za-z0-9_-]{3,30}$/; // Whitelists alphanumeric, underscores, and hyphens (min 3, max 30 chars)
const contentRegex = /^[A-Za-z0-9\s,.!?'-]{1,500}$/; // Whitelists alphanumeric and common punctuation (max 500 chars)
const imageRegex = /^(http[s]?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i; // Whitelists URLs ending in image file extensions

// Function to validate input using regex
const validateInput = (data) => {
  if (!userRegex.test(data.user)) {
    return { isValid: false, message: "Invalid user format." };
  }
  if (!contentRegex.test(data.content)) {
    return { isValid: false, message: "Invalid content format." };
  }
  if (data.image && !imageRegex.test(data.image)) {
    return { isValid: false, message: "Invalid image URL format." };
  }
  return { isValid: true };
};

//Create an transaction
router.post("/transaction", checkauth, async (req, res) => {
  let newDocument = {
    amount: req.body.amount,
    currency: req.body.currency,
    provider: "SWIFT",
  };
  let collection = await db.collection("transactions");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

export default router;
