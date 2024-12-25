import express from 'express';
import { connectDB } from './db/connect-db.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
})

app.get('/', (req, res) => {
  res.send('Hello World 123');
});

// 8zyqOdvvVXnaBS84
// mongodb+srv://brennaldwinsantiago:8zyqOdvvVXnaBS84@cluster0.a7cw4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0