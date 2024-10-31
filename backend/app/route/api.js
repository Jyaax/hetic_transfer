import express from "express";
import multer from "multer";
import { handleUploadFiles } from "../controller/api_controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Dossier temporaire pour les uploads

// Route pour upload un fichier
router.post("/upload", upload.single("file"), (req, res) => {
  handleUploadFiles(req, res);
});

export default router;
