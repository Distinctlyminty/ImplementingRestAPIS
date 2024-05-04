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

// Passport JWT options
// const options = {
//   secretOrKey: secretKey,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   issuer: "https://token.globomantics.com/fe393fd2-baf4-4426-af97-2aa7578a31f2/",
//   audience: "8d3370fd-59e6-47d0-8cc6-a04f95fe7908",
// };

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