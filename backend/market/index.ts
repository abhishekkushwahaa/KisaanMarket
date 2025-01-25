import express from 'express'
import cors from 'cors'
import errorHandling from '@/middlewares/errorHandling'
require('dotenv').config()
import cropsRoute from '@/routes/cropsRoute'

const app = express()

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", cropsRoute);

// Error handling middleware
app.use(errorHandling);

// Start server for
app.listen(process.env.PORT, () => {
  console.log(`Postgres Server listening on port ${process.env.PORT}`)
})
