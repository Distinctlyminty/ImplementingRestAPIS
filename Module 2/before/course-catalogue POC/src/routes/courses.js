// routes/courses.js
const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Import the course model
const CourseModel = require("../models/courseSchema");

// POST: Create a new course

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: There was a problem with the request
 */
router.post("/", async (req, res) => {
  try {
    let course = new CourseModel(req.body);
    course = await course.save();
    res.send(course);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// GET: Fetch all courses

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */
router.get("/", async (req, res) => {
  const courses = await CourseModel.find();
  res.send(courses);
});

// GET: Fetch a single course by courseId
/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Retrieve a specific course by courseId
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: A specific course.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get("/:courseId", async (req, res) => {
  const course = await CourseModel.findOne({ courseId: req.params.courseId });
  if (!course) return res.status(404).send("Course not found.");
  res.send(course);
});

// PUT: Update an existing course

/**
 * @swagger
 * /courses/{courseId}:
 *   put:
 *     summary: Update a specific course by courseId
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.put("/:courseId", async (req, res) => {
  const course = await CourseModel.findOneAndUpdate(
    { courseId: req.params.courseId },
    req.body,
    { new: true }
  );
  if (!course) return res.status(404).send("Course not found.");
  res.send(course);
});

// DELETE: Delete a course

/**
 * @swagger
 * /courses/{courseId}:
 *   delete:
 *     summary: Delete a specific course by courseId
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: The course was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.delete("/:courseId", async (req, res) => {
  const course = await CourseModel.findOneAndDelete({
    courseId: req.params.courseId,
  });
  if (!course) return res.status(404).send("Course not found.");
  res.send(course);
});

module.exports = router;
