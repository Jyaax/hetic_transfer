import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileRoutes from './route/routes.js';

dotenv.config();

console.log(process.env);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/file", fileRoutes);

app.listen(port, () => console.log(`App running on port ${port}`));
