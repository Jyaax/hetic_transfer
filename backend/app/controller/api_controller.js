import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { validationResult } from "express-validator";
import { database } from "../repository/db.js";

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

// Regarder les utilisateurs dans la db
export function getUsersRead() {
  return async (req, res) => {
    try {
      const allUsers = await database.query("SELECT id, email, firstname, lastname FROM users");
      res.json(allUsers);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs: ', error);
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  };
}

export function testDatabaseConnection() {
  return async (req, res) => {
    try {
      const connection = await database.getConnection();

      // Test de la connexion
      await connection.ping();
      console.log("Connexion réussie à la base de données");

      // Affichez les tables disponibles
      const [tables] = await connection.query("SHOW TABLES");
      console.log("Tables dans la base de données `hetic_transfer`:", tables);

      // Récupérez un échantillon de données de la table 'users'
      const [sampleData] = await connection.query("SELECT * FROM users LIMIT 1");
      console.log("Échantillon de données de la table `users`:", sampleData);

      // Terminer la connexion
      connection.release();

      // Envoyer une réponse JSON pour confirmer que tout est OK
      res.status(200).json({
        message: "Connexion réussie à la base de données",
        tables,
        sampleData,
      });
    } catch (error) {
      console.error("Échec de la connexion à la base de données ou erreur lors de l'accès aux données:", error);
      res.status(500).json({
        message: "Erreur lors de la connexion à la base de données",
        error: error.message,
      });
    }
  };
}