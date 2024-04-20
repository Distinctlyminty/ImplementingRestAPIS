const express = require("express");
const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const generateTestData = require("./data/TestData");
const app = express();
app.use(express.json());
require("./swagger")(app);

// Define secret key
const secretKey = process.env.SECRET_KEY || "someRandomSecretKey";

// Passport Bearer Strategy
passport.use(
  "oauth-bearer",
  new BearerStrategy(function (token, done) {
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) return done(err);
      return done(null, decoded, { scope: "read" });
    });
  })
);


// Import and use the router
const coursesRouter = require("./routes/courses");
app.use("/api", passport.authenticate("oauth-bearer", { session: false }), coursesRouter);

// Endpoint to return a dummy token - do not use in production code!
app.get("/oauth2/v2.0/token", (req, res) => {
  const payload = {
    sub: "1234567890",
    name: "John Doe",
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

// Generate test data
generateTestData()
  .then(() => console.log("Seed function executed successfully"))
  .catch((err) => console.error("Error executing seed function", err));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});