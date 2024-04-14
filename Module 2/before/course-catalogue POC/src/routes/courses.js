// routes/courses.js
const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dbClient = require("../dbClient");

// Import the course model
const CourseModel = require("../models/courseSchema");

// POST: Create a new course

/**
 * @swagger
 * /course:
 *   post:
 *     summary: Create a new course
 *     tags: [Course]
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
router.post("/course", async (req, res) => {
  try {
    await dbClient.connect();
    let course = new CourseModel(req.body);
    course = await course.save();
    res.send(course);
  } catch (error) {
    res.status(400).send(error.message);
  } finally {
    await dbClient.disconnect();
  }
});

// GET: Fetch all courses

/**
 * @swagger
 * /course:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Course]
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
router.get("/course", async (req, res) => {
  try {
    await dbClient.connect();
    const courses = await CourseModel.find();
    if (!courses) {
      res.status(404).send("No courses found");
    } else {
      res.send(courses);
    }
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await dbClient.disconnect();
  }
});

// GET: Fetch a single course by id
/**
 * @swagger
 * /course/{id}:
 *   get:
 *     summary: Retrieve a specific course by id
 *     tags: [Course]
  *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the vehicle to retrieve.
 *         schema:
 *           type: string
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
router.get("/course/:id", async (req, res) => {
  try {
    await dbClient.connect();
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found.");
    res.send(course);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await dbClient.disconnect();
  }
});

// PUT: Update an existing course

/**
 * @swagger
 * /course/{id}:
 *   put:
 *     summary: Update a specific course by id
 *     tags: [Course]
  *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the vehicle to update.
 *         schema:
 *           type: string
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
router.put("/course/:id", async (req, res) => {
  try {
    await dbClient.connect();
    const course = await CourseModel.findByIdAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!course) return res.status(404).send("Course not found.");
    res.send(course);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await dbClient.disconnect();
  }
});

// DELETE: Delete a course

/**
 * @swagger
 * /course/{id}:
 *   delete:
 *     summary: Delete a specific course by id
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the course to delete.
 *         schema:
 *           type: string
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
router.delete("/course/:id", async (req, res) => {
  try {
    await dbClient.connect();
    const course = await CourseModel.findByIdAndDelete({
      id: req.params.id,
    });
    if (!course) return res.status(404).send("Course not found.");
    res.send(course);
  } catch (err) {
    res.status(500).send(err);
  } finally {
    await dbClient.disconnect();
  }
});

module.exports = router;
