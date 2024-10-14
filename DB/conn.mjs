import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionstring = process.env.ATLAS_URL;

console.log(connectionstring);

const client = new MongoClient(connectionstring);
let conn;
try {
    conn == await client.connect();
    console.log("MongoDB is connected!!");
} catch (error) {  
    console.log(error);
}

let db = client.db("users");

export default db;