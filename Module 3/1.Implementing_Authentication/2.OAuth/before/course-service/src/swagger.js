const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course API",
      version: "1.0.0",
      description: "A REST API for exposing LMS course data",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local server",
      },
      {
        url: "https://course-service.azurewebsites.net/api",
        description: "Production server",
      },
    ],
  },
  apis: ["./models/courseSchema.js", "./routes/courses.js"],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
};