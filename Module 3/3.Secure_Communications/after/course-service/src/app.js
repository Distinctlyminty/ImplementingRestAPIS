const express = require("express");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const BearerStrategy = require("passport-http-bearer").Strategy;
const jwt = require("jsonwebtoken");
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const generateTestData = require("./data/TestData");
const app = express();
app.use(express.json());
require("./swagger")(app);

// Use helmet to set various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: false, // disable it if you don't serve any HTML
  hidePoweredBy: true, // hide X-Powered-By header
  hsts: true, // enforce HTTPS
  ieNoOpen: true, // set X-Download-Options for IE8+
  noSniff: true, // set X-Content-Type-Options to prevent MIME-sniffing
  frameguard: { action: 'deny' }, // provide clickjacking protection
  xssFilter: true, // enable XSS filter in most recent web browsers
}));

// Enable CORS
// Defaults to allowing all origins
//app.use(cors());

// To allow only specific origins, use the following configuration:
app.use(cors({
  origin: 'https://example.com' // replace with your origin
}));


// Define secret key
const secretKey = process.env.SECRET_KEY || "someRandomSecretKey";

// Passport JWT options
const options = {
  secretOrKey: secretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: "https://token.globomantics.com/fe393fd2-baf4-4426-af97-2aa7578a31f2/",
  audience: "8d3370fd-59e6-47d0-8cc6-a04f95fe7908",
};

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

// Endpoint to return a dummy token - do not use in production code!
app.get("/oauth2/v2.0/token", (req, res) => {
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

// Generate test data
generateTestData()
  .then(() => console.log("Seed function executed successfully"))
  .catch((err) => console.error("Error executing seed function", err));

// Start the server

const httpsOptions = {
  key: fs.readFileSync('./certificate/localhost.key'),
  cert: fs.readFileSync('./certificate/localhost.crt')
};

// Start the server with HTTPS
const port = process.env.PORT || 3000;
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
