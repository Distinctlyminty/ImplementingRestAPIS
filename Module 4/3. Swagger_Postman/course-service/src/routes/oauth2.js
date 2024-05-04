// Endpoint to return a dummy token - do not use in production code!
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const secretKey = process.env.SECRET_KEY || "someRandomSecretKey";


router.get("/v2.0/token", (req, res) => {
    const payload = {
      sub: "1234567890",
      name: "John Doe",
      roles: ["admin"], // Add roles here
      permissions: [ // Add permissions here
      { resource: 'course', action: 'create' },
      { resource: 'course', action: 'read' },
      { resource: 'course', action: 'update' },
      { resource: 'course', action: 'delete' },
      // Add more permissions as needed
    ],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      aud: "8d3370fd-59e6-47d0-8cc6-a04f95fe7908",
      iss: "https://token.globomantics.com/fe393fd2-baf4-4426-af97-2aa7578a31f2/",
    };
    const token = jwt.sign(payload, secretKey);

    res.json({
      access_token: token,
      token_type: "Bearer",
      expires_in: 3600,
    });
  });

  module.exports = router;