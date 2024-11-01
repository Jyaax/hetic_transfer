import express from "express";
import {generateShareLink,downloadFile,displayFiles,deleteFiles,renameFiles} from "../controller/file_controllers.js";
import {handleUploadFiles,getUploadsSize, getSignUp, testDatabaseConnection} from "../controller/api_controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

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

// Base de données
router.get('/test', testDatabaseConnection())
router.post("/inscription", checkSchema(user_schema), getSignUp());

export default router;
