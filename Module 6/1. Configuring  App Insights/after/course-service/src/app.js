const express = require("express");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const appInsights = require('applicationinsights');

console.log(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING);
appInsights.setup()
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();

const appInsightsClient = appInsights.defaultClient;

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

// Custom middleware to log request data
app.use((req, res, next) => {
  const telemetry = {
      method: req.method,
      url: req.url,
      startTime: new Date().toISOString()
  };

  // Log the request
  appInsightsClient.trackEvent({ name: "incomingRequest", properties: telemetry });

  // Continue to next middleware or route handler
  next();
});


// Protect the API endpoint
app.use("/api", passport.authenticate("oauth-bearer", { session: false }));

// Error handling middleware 
app.use((err, req, res, next) => {
  appInsightsClient.trackException({ exception: err });
  console.error(err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({ error: "Invalid ID" });
  }

  if (err.code && err.code == 11000) {
    return res.status(409).json({ error: "Duplicate key error" });
  }

  res.status(500).json({ error: "Internal Server Error" });
});

// Import and use the router
const coursesRouter = require("./routes/courses");
app.use("/api", coursesRouter);
app.use("/oauth2", require("./routes/oauth2"));
module.exports = app;