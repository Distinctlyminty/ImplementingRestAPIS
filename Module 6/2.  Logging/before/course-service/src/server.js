const app = require("./app");
const generateTestData = require("./data/TestData");

if (process.env.GENERATE_TEST_DATA === "true") {
  generateTestData()
    .then(() => console.log("Seed function executed successfully"))
    .catch((err) => console.error("Error executing seed function", err));
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
