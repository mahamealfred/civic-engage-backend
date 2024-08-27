const express = require('express');
const cors = require('cors');
const dbConnect = require("./src/config/db");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./src/routes/userRoutes');
const surveyRoutes = require('./src/routes/surveyRoutes');
const issueRoutes = require('./src/routes/issueRoutes');

app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/issues', issueRoutes);

dbConnect();
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
