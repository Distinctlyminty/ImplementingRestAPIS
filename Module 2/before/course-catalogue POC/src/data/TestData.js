const dbClient = require("../dbClient");
const Course = require("../models/courseSchema"); 


const titles = [
  "Introduction to Software Engineering",
  "Advanced Data Structures and Algorithms",
  "Principles of Computer Systems Design",
  "Machine Learning for Engineers",
  "Fundamentals of Network Engineering",
];
const authors = ["John Doe", "Jane Smith", "Charlie Brown"];

const descriptions = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Vestibulum condimentum dolor nec ultrices posuere.",
  "Sed in lacus auctor, ultricies lorem non, vehicula nisl.",
];

const durations = [30, 60, 90];
const urls = [
  "api.globomantics.com",
  "api.globomantics.com",
  "api.globomantics.com",
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function generateTestData() {
  await dbClient.connect();
  await Course.deleteMany();

  for (let i = 0; i < 10; i++) { 
    const courseData = {
      title: getRandomElement(titles),
      description: getRandomElement(descriptions),
      instructor: getRandomElement(authors),
      duration: getRandomElement(durations),
    };

    // Create the course in the database
    const course = new Course(courseData);
    await course.save();

    // Update the course with the streamingURL
    course.streamingURL = `http://localhost:3000/api/course/${course._id}`;
    await course.save();
  }
  await dbClient.disconnect();

}
module.exports = generateTestData;
