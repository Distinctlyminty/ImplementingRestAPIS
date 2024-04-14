const express = require("express");
const mongoose = require("mongoose");
const Course = require("./models/courseSchema");
const app = express();
const generateTestData = require("./data/TestData");

app.use(express.json());

require("./swagger")(app);

// add the test data
generateTestData()
  .then(() => console.log('Seed function executed successfully'))
  .catch(err => console.error('Error executing seed function', err));

// Import and use the router
const coursesRouter = require("./routes/courses");
app.use("/api", coursesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
