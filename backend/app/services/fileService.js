import fs from "fs";
import path from "path";

// Obtenir le chemin du répertoire courant
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const metadataFilePath = path.join(__dirname, "fileMetadata.json");

// Vérifie si le quota est dépassé
export async function checkQuota(userId, newFileSize, quotaLimit) {
  const metadata = await getFileMetadata(userId);
  const totalSize = metadata.reduce((acc, file) => acc + file.size, 0);
  return totalSize + newFileSize <= quotaLimit;
}

// Sauvegarde les métadonnées d'un fichier
export async function saveFileMetadata(userId, file) {
  const metadata = await getFileMetadata(userId);
  metadata.push({
    id: file.path, // Utiliser le chemin comme identifiant pour simplifier
    name: file.originalname,
    size: file.size,
    uploadDate: new Date().toISOString(),
  });
  fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
}

// Récupère les métadonnées d'un utilisateur
export async function getFileMetadata(userId) {
  if (!fs.existsSync(metadataFilePath)) {
    return [];
  }
  const metadata = JSON.parse(fs.readFileSync(metadataFilePath));
  return metadata.filter((file) => file.userId === userId);
}

// Supprime les métadonnées d'un fichier
export async function deleteFileData(fileId) {
  const metadata = await getFileMetadata(); // Récupère toutes les métadonnées
  const newMetadata = metadata.filter((file) => file.id !== fileId);
  if (metadata.length === newMetadata.length) {
    return false; // Aucune entrée supprimée, fichier non trouvé
  }
  fs.writeFileSync(metadataFilePath, JSON.stringify(newMetadata, null, 2));
  return true; // Suppression réussie
}
