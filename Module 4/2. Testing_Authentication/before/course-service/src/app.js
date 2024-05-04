const express = require("express");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

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

// Protect the API endpoint
app.use("/api", passport.authenticate("oauth-bearer", { session: false }));

// Import and use the router
const coursesRouter = require("./routes/courses");
app.use("/api", coursesRouter);
app.use("/oauth2", require("./routes/oauth2"));

module.exports = app;