const express = require('express');
const cors = require('cors');
const dbConnect = require("./src/config/db");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./src/routes/userRoutes');
const issueRoutes = require('./src/routes/issueRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const departmentRoutes = require('./src/routes/departmentRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');

app.use('/api/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/feedbacks', feedbackRoutes);

dbConnect();
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
