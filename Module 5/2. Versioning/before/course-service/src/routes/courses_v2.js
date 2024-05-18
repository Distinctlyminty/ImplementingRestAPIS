// routes/courses.js
const express = require("express");
const router = express.Router();


// POST: Create a new course - only admin users can access this endpoint
router.post("/course",ensureRole('admin'), ensurePermission('course', 'create'), async (req, res) => {
  return res.status(200).send("NOT IMPLEMENTED");
});

// GET: Fetch all courses
router.get("/course", ensurePermission('course', 'read'), async (req, res) => {
  return res.status(200).send("NOT IMPLEMENTED");
});

// GET: Fetch a single course by id
router.get("/course/:id", ensurePermission('course', 'read'), async (req, res) => {
  return res.status(200).send("NOT IMPLEMENTED");
});

// PUT: Update an existing course
router.put("/course/:id",ensurePermission('course', 'update'), async (req, res) => {
  return res.status(200).send("NOT IMPLEMENTED");
});

// DELETE: Delete a course
router.delete("/course/:id",ensurePermission('course', 'delete'), async (req, res) => {
 return res.status(200).send("NOT IMPLEMENTED");
});

module.exports = router;
