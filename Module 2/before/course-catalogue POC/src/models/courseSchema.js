const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course
 *         description:
 *           type: string
 *           description: A brief description of the course
 *         instructor:
 *           type: string
 *           description: The instructor of the course
 *         duration:
 *           type: number
 *           description: The duration of the course in minutes
 *         streamingURL:
 *           type: string
 *           description: The URL for the streaming link of the course
 *       example:
 *         title: "Introduction to Computer Science"
 *         description: "An introduction to the fundamental concepts of computer science"
 *         instructor: "John Doe"
 *         duration: 120
 *         streamingURL: "http://example.com/stream"
 */
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  instructor: String,
  duration: Number, // duration in minutes
  streamingURL: String, // url for the streaming link
});

module.exports = mongoose.model("courseModel", courseSchema);
