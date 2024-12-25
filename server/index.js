import express from 'express';
import { connectDB } from './db/connect-db.js';
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

app.use("/api/auth", authRoutes)
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World 123');
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
})

