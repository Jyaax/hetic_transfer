import express from "express";
import cors from "cors";
import { getRoutes } from "./route/api.js";
import { getAdminRoutes } from "./route/admin.js";
import mysql from "mysql2/promise";
import { getRepository } from "./repository/repository.js";
import * as process from "node:process";

const server = express();
const port = 3000;

const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "express",
});

server.use(cors());

const repository = getRepository(database);

const app = {
  repository,
};

const routes = getRoutes(app);
const adminRoutes = getAdminRoutes();

server.use(express.json());
server.use(express.static("./public"));

server.use(routes);
// server.use("/admin", adminRoutes)

server.use((req, res, next) => {
  res.status(404);
  res.json({
    message: "t'es perdu",
  });
});

server.listen(port, () => console.log(`App running on port ${port}`));
