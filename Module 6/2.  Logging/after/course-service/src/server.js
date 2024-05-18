const app = require("./app");
const generateTestData = require("./data/TestData");
const logger = require('./logger');

if (process.env.GENERATE_TEST_DATA === "true") {
  generateTestData()
    .then(() => logger.log('info', "Seed function executed successfully"))
    .catch((err) => logger.error("Error executing seed function", err));
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.log('info', `Listening on port ${port}...`);});
