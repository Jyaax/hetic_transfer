import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  handleUploadFiles,
  getUploadsSize,
} from "../controller/api_controller.js";

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), "uploads") }); // Assurez-vous que multer utilise le bon chemin

// Route pour upload un fichier
router.post("/upload", upload.single("file"), (req, res) => {
  handleUploadFiles(req, res);
});

// Route pour vérifier la taille du dossier uploads
router.get("/size", getUploadsSize);

export default router;
