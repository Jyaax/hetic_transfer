import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Fonction pour gérer l'upload
export function handleUploadFiles(req, res) {
  // Vérifie s'il y a bien un fichier
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, error: "Aucun fichier à uploader." });
  }

 
  const uniqueId = uuidv4();
  const fileExtension = path.extname(req.file.originalname);
  const newFileName = `${uniqueId}${fileExtension}`;
  const uploadPath = path.join("uploads", newFileName);

  
  fs.rename(req.file.path, uploadPath, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: "Erreur lors du déplacement du fichier.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fichier uploadé avec succès.",
      fileName: newFileName,
    });
  });
}


export const getUploadsSize = (req, res) => {
  const uploadDir = path.join(process.cwd(), "uploads");

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
};
