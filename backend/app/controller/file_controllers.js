import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");


const { JWT_SECRET, JWT_EXPIRATION } = process.env;

// Fonction pour générer un lien de partage
export function generateShareLink(req, res) {
  try {
    const { fileId } = req.params;
    const { userId } = req.body;

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "La configuration du serveur est incorrecte. JWT_SECRET est manquant." });
    }
    if (!fileId || !userId) {
      return res.status(400).json({ message: "Paramètres manquants : fileId ou userId." });
    }

    const token = jwt.sign({ fileId, userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.json({ shareLink: `${req.protocol}://${req.get("host")}/file/download/${token}` });
  } catch (error) {
    console.error("Erreur lors de la génération du lien de partage :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}

// Fonction pour gérer le téléchargement de fichier
export function downloadFile(req, res) {
  try {
    const { token } = req.params;

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "La configuration du serveur est incorrecte. JWT_SECRET est manquant." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Erreur de vérification du token :", err);
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Le lien de partage a expiré." });
        }
        return res.status(401).json({ message: "Lien de partage invalide." });
      }

      const { fileId } = decoded;
      if (!fileId) {
        return res.status(400).json({ message: "ID de fichier manquant dans le token." });
      }

      const filePath = path.join("uploads", fileId);

      // Assurez-vous que le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Fichier non trouvé." });
      }

      // Utilisez le nom de fichier tel qu'il est
      const originalFileName = fileId;

      // Ajoutez l'en-tête Content-Disposition pour le téléchargement
      res.setHeader("Content-Disposition", `attachment; filename="${originalFileName}"`);

      res.sendFile(path.resolve(filePath), (err) => {
        if (err) {
          console.error("Erreur lors de l'envoi du fichier :", err);
          return res.status(500).json({ message: "Erreur lors de l'envoi du fichier." });
        }
      });
    });
  } catch (error) {
    console.error("Erreur interne lors du téléchargement :", error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
}




// Fonction pour afficher les fichiers
export function displayFiles(req, res) {
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la lecture du dossier." });
    }

    res.json({ files });
  });
}

// Fonction pour renommer les fichiers
export function renameFiles(req, res) {
  const { oldFileName, newFileName } = req.body;

  if (!oldFileName || !newFileName) {
    return res.status(400).json({ message: "Les noms de fichier sont requis." });
  }

  const oldFilePath = path.join(uploadDir, oldFileName);
  const newFilePath = path.join(uploadDir, newFileName);

  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors du renommage du fichier." });
    }
    res.json({ message: "Fichier renommé avec succès." });
  });
}

// Fonction pour supprimer les fichiers
export function deleteFiles(req, res) {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ message: "Le nom du fichier est requis." });
  }

  const filePath = path.join(uploadDir, fileName);

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: "Erreur lors de la suppression du fichier." });
    }
    res.json({ message: "Fichier supprimé avec succès." });
  });
}