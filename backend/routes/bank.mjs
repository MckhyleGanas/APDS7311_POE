import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import checkauth from "../check-auth.mjs";
import checkauthemp from "../check-auth-emp.mjs";
import helmet from "helmet";
import Joi from "joi";

const router = express.Router();

router.use(helmet()); // Use helmet

// Specifically set the X-Frame-Options header to DENY or SAMEORIGIN
router.use(helmet.frameguard({ action: "deny" }));

const schema = Joi.object({
  sendername: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Name must be alphabetic.",
    }),
  bankname: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Bank Name must be alphabetic.",
    }),
  branchcode: Joi.string()
    .pattern(/^[0-9]{6,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Branch Code must be numeric and must be six digits long",
    }),
  accountnumber: Joi.string()
    .pattern(/^[0-9]{10,}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Account number must be numeric and at least 10 digits.",
    }),
  swiftcode: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,11}$/)
    .required()
    .messages({
      "string.pattern.base":
        "SWIFT code must have letters and numbers and be between 8-11 characters.",
    }),
  amount: Joi.string()
    .pattern(/^[0-9]{1,}$/)
    .required()
    .messages({
      "string.pattern.base": "Amount must be numeric and should be above R1.",
    }),
  currency: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Currency must have letters and should be 3 letters",
    }),
});

//Create an transaction (add name, bank name, branch code, account number, swiftcode)
router.post("/transaction", checkauth, async (req, res) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let newDocument = {
    sendername: req.body.sendername,
    bankname: req.body.bankname,
    branchcode: req.body.branchcode,
    accountnumber: req.body.accountnumber,
    swiftcode: req.body.swiftcode,
    amount: req.body.amount,
    currency: req.body.currency,
    provider: "SWIFT",
    verified: false,
  };
  let collection = await db.collection("transactions");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// Get all transactions
router.get("/transactions", checkauth, async (req, res) => {
  try {
    let collection = await db.collection("transactions");
    let results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving transactions", error: error.message });
  }
});

// Get verified transactions
router.get("/transactions/verified", checkauthemp, async (req, res) => {
  try {
    let collection = await db.collection("transactions");
    let results = await collection.find({ verified: true }).toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving verified transactions",
      error: error.message,
    });
  }
});

// Get unverified transactions
router.get("/transactions/unverified", checkauthemp, async (req, res) => {
  try {
    let collection = await db.collection("transactions");
    let results = await collection.find({ verified: false }).toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving unverified transactions",
      error: error.message,
    });
  }
});

export default router;
