// routes/courses.js
const express = require("express");
const router = express.Router();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const dbClient = require("../dbClient");

// Import the course model
const CourseModel = require("../models/courseSchema");

// Role based access control - Middleware that checks if the user has the specified role
function ensureRole(role) {
  return function(req, res, next) {
    if (req.user && req.user.roles.includes(role)) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}

// Attribute based access control - Middleware that checks if the user has the specified permission
function ensurePermission(resource, action) {
  return function(req, res, next) {
    const hasPermission = req.user.permissions.some(
      p => p.resource === resource && p.action === action
    );

    if (hasPermission) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  }
}


// Custom error handler middleware
function errorHandler(err, req, res, next) {
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
}

// Use the error handler middleware
router.use(errorHandler);

// POST: Create a new course - only admin users can access this endpoint

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
router.post("/course",ensureRole('admin'), ensurePermission('course', 'create'), async (req, res) => {
  try {
    await dbClient.connect();
    let course = new CourseModel(req.body);
    course = await course.save();
    res.send(course);
  } catch (error) {
    next(error);
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
router.get("/course", ensurePermission('course', 'read'), async (req, res) => {
  try {
    await dbClient.connect();
    const courses = await CourseModel.find();
    if (!courses) {
      res.status(404).send("No courses found");
    } else {
      res.send(courses);
    }
  } catch (err) {
    next(error);
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
router.get("/course/:id", ensurePermission('course', 'read'), async (req, res) => {
  try {
    await dbClient.connect();
    const course = await CourseModel.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found.");
    res.send(course);
  } catch (err) {
    next(error);
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
router.put("/course/:id",ensurePermission('course', 'update'), async (req, res) => {
  try {
    await dbClient.connect();
    const course = await CourseModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) return res.status(404).send("Course not found.");
    res.send(course);
  } catch (err) {
    next(error);
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
router.delete("/course/:id",ensurePermission('course', 'delete'), async (req, res) => {
  try {
    await dbClient.connect();
    const course = await CourseModel.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).send("Course not found.");
    res.send(course);
  } catch (err) {
    next(error);
  } finally {
    await dbClient.disconnect();
  }
});

module.exports = router;
