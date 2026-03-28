import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import libraryRouter from './routes/libraryRoutes.js';

dotenv.config();
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use('/', libraryRouter);

const dbURI = process.env.MONGOURI;
mongoose.connect(dbURI, {}).then(() => {
  console.log("Connection successful");
}).catch((error) => {
  console.error("Connection failed", error);
});

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});