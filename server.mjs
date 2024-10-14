const https = require('https');
const https = require('http');
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 3000;

// SSL credentials
const privateKey = fs.readFileSync('Keys/Keys_Jarryd/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('path/Keys_Jarryd/certificate.pem', 'utf8');

//const privateKey = fs.readFileSync('Keys/Keys_Jarryd/privatekey.pem', 'utf8');
//const certificate = fs.readFileSync('path/Keys_Jarryd/certificate.pem', 'utf8');

//const privateKey = fs.readFileSync('Keys/Keys_Mckhyle/privatekey.pem', 'utf8');
//const certificate = fs.readFileSync('path/Keys_Mckhyle/certificate.pem', 'utf8');

//const privateKey = fs.readFileSync('Keys/Keys_Kamo/privatekey.pem', 'utf8');
//const certificate = fs.readFileSync('path/Keys_Kamo/certificate.pem', 'utf8');

//const privateKey = fs.readFileSync('Keys/Keys_Given/privatekey.pem', 'utf8');
//const certificate = fs.readFileSync('path/Keys_Given/certificate.pem', 'utf8');

//const privateKey = fs.readFileSync('Keys/Keys_Rue/privatekey.pem', 'utf8');
//const certificate = fs.readFileSync('path/Keys_Rue/certificate.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log('Server is running securely on port 3000');
});
