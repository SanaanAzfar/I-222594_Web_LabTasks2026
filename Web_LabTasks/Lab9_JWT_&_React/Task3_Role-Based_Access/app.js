import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/userRoutes.js';

dotenv.config();
const app=express();
const port=5000;

app.use(express.json());
app.use(cors());
app.use('/', router);

const dbURI = process.env.MONGOURI;
mongoose.connect(dbURI,{}).then(()=>{
  console.log("Connection successful");
}).catch((error)=>{
  console.error("Connection successful", error);
});

app.listen(port,()=>{
  console.log('Server is running on port '+port);
});