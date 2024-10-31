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

  //Remplace le nom du fichier pas un id unique en conservant son extension
  const uniqueId = uuidv4();
  const fileExtension = path.extname(req.file.originalname);
  const newFileName = `${uniqueId}${fileExtension}`;
  const uploadPath = path.join("uploads", newFileName);

  //Met le fichier au bon endroit
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
