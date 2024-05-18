const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const generateTestData = require("../data/TestData");

let server;

beforeAll((done) => {
  server = app.listen(3001, async () => {
    try {
      await generateTestData();
      console.log("Test data generated successfully");
      done();
    } catch (err) {
      console.error("Error generating test data", err);
      done(err);
    }
  });
});

afterAll((done) => {
  server.close(done);
});

describe("GET /api/course", () => {
  it("should return a list of courses when the user has the correct permissions", async () => {
    //setup
    let permissions = [{ resource: "course", action: "read" }];

    let roles = ["user"];

    const token = getAuthToken(roles, permissions);
    const res = await request(server)
      .get("/api/course/")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return a 403 status when the user has the wrong permissions", async () => {
    //setup
    let permissions = [];

    let roles = ["user"];

    const token = getAuthToken(roles, permissions);
    const res = await request(server)
      .get("/api/course/")
      .set("Authorization", "Bearer " + token);

    expect(res.statusCode).toEqual(403);
  });
});

function getAuthToken(roles, permissions) {
  const payload = {
    sub: "1234567890",
    name: "John Doe",
    roles: roles,
    permissions: permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    aud: "8d3370fd-59e6-47d0-8cc6-a04f95fe7908",
    iss: "https://token.globomantics.com/fe393fd2-baf4-4426-af97-2aa7578a31f2/",
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY);
  return token;
}
