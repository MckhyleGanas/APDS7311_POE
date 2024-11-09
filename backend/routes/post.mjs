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

// Get all the records
router.get("/", async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
});

// Create a new record
router.post("/upload", checkauth, async (req, res) => {
  // Validate input before processing
  const validation = validateInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  let newDocument = {
    user: req.body.user,
    content: req.body.content,
    image: req.body.image,
  };
  
  let collection = await db.collection("posts");
  let result = await collection.insertOne(newDocument);
  res.status(204).send(result);
});

// Update a record by id
router.patch("/:id", checkauth, async (req, res) => {
  // Validate input before processing
  const validation = validateInput(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      user: req.body.user,
      content: req.body.content,
      image: req.body.image,
    },
  };

  let collection = await db.collection("posts");
  let result = await collection.updateOne(query, updates);
  res.status(200).send(result);
});

// Get a single record by id
router.get("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  
  let collection = await db.collection("posts");
  let result = await collection.findOne(query);
  
  if (!result) {
    res.status(404).send("Not found");
  } else {
    res.status(200).send(result);
  }
});

// Delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  
  const collection = db.collection("posts");
  let result = await collection.deleteOne(query);
  
  res.status(200).send(result);
});

export default router;
