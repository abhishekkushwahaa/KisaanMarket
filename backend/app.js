const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require("./src/config/mongoose.js");
const authRoutes = require('./src/routes/authRoutes.js');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

module.exports = app;
