import express from 'express';
import { connectDB } from './db/connectDB.js';
import dotenv from "dotenv";
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json()); // to parse json data in the request body
app.use(cookieParser()); // to parse cookies

app.use("/api/auth", authRoutes)
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World 123');
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
})

