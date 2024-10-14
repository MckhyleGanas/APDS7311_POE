const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();

// SSL credentials
const privateKey = fs.readFileSync('Keys/Keys_Jarryd/privatekey.pem', 'utf8');
const certificate = fs.readFileSync('path/Keys_Jarryd/certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
    console.log('Server is running securely on port 443');
});
