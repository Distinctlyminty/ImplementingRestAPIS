const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Basic Authentication Middleware
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send('Access denied. No credentials sent!');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Replace 'admin' and 'password' with your actual username and password
    if (username === 'admin' && password === 'password') {
        next();
    } else {
        res.status(401).send('Access denied. Incorrect credentials!');
    }
};

app.use(basicAuth);

app.get('/', (req, res) => {
    res.send('You are authenticated');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
