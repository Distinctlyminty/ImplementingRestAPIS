const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

require('./swagger')(app);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/courseDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Import and use the router
const coursesRouter = require('./routes/courses');
app.use('/api/courses', coursesRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
