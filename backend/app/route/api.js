import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { handleUploadFiles } from "../controller/api_controller.js";

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), "uploads") }); // Assurez-vous que multer utilise le bon chemin

// Route pour upload un fichier
router.post("/upload", upload.single("file"), (req, res) => {
  handleUploadFiles(req, res);
});

// Route pour vérifier la taille du dossier uploads
router.get("/size", (req, res) => {
  const uploadDir = path.join(process.cwd(), "uploads");
  console.log("Chemin du dossier uploads :", uploadDir);

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Erreur lors de la lecture du dossier :", err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la lecture du dossier" });
    }

    let totalSize = 0;
    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      totalSize += fs.statSync(filePath).size;
    });

    const sizeInGB = totalSize / (1024 * 1024 * 1024);
    res.json({ sizeInGB });
  });
});

export default router;
