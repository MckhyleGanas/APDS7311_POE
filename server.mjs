import https from "https";
import http from "http";
import fs from "fs";
import banks from "./routes/bank.mjs";
import users from "./routes/user.mjs";
import express from "express";
import cors from "cors";

const PORT = 3000;
const app = express();

// SSL credentials
// const privateKey = fs.readFileSync('Keys/Keys_Jarryd/privatekey.pem', 'utf8');
// const certificate = fs.readFileSync('Keys/Keys_Jarryd/certificate.pem', 'utf8');

// const privateKey = fs.readFileSync('Keys/Keys_Mckhyle/privatekey.pem', 'utf8');
// const certificate = fs.readFileSync('Keys/Keys_Mckhyle/certificate.pem', 'utf8');

const privateKey = fs.readFileSync("Keys/Keys_Kamo/privatekey.pem", "utf8");
const certificate = fs.readFileSync("Keys/Keys_Kamo/certificate.pem", "utf8");

// const privateKey = fs.readFileSync('Keys/Keys_Given/privatekey.pem', 'utf8');
// const certificate = fs.readFileSync('Keys/Keys_Given/certificate.pem', 'utf8');

//const privateKey = fs.readFileSync('Keys/Keys_Rue/privatekey.pem', 'utf8');
//const certificate = fs.readFileSync('Keys/Keys_Rue/certificate.pem', 'utf8');

const options = { key: privateKey, cert: certificate };

app.use(cors());
app.use(express.json());

app.use((reg, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/bank", banks);
app.route("/bank", banks);
app.use("/user", users);
app.route("/user", users);

let server = https.createServer(options, app);
console.log(PORT);
server.listen(PORT);
