import express from "express";
import {
  generateShareLink,
  downloadFile,
  displayFiles,
  deleteFiles,
  renameFiles,
} from "../controller/file_controllers.js";
import {
  handleUploadFiles,
  getUploadsSize,
} from "../controller/api_controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Dossier temporaire pour les uploads

// Route pour upload un fichier
router.post("/upload", upload.single("file"), (req, res) => {
  handleUploadFiles(req, res);
});

// Route pour générer un lien de partage
router.post("/generate-share-link/:fileId", generateShareLink);

// Route pour télécharger un fichier
router.get("/download/:token", downloadFile);

// Route pour afficher les fichiers
router.get("/list-files", displayFiles);

// Route pour modifier le nom d'un fichier
router.put("/rename-file", renameFiles);

// Route pour supprimer un fichier
router.delete("/delete-file", deleteFiles);

// Route pour vérifier la taille du dossier uploads
router.get("/size", getUploadsSize);

export default router;
