import express from 'express';
import jwt from 'jsonwebtoken';
import * as path from 'path';

const router = express.Router();
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

// Fonction fictive pour récupérer le chemin du fichier
const getFilePath = (fileId) => {
    return `/backend/app/uploads/${fileId}`;
};

console.log("JWT_EXPIRATION:", JWT_EXPIRATION);


// Génération du lien de partage temporaire
router.post('/generate-share-link/:fileId', (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.body;

        if (!JWT_SECRET) {
            return res.status(500).json({ message: "La configuration du serveur est incorrecte. JWT_SECRET est manquant." });
        }

        if (!fileId || !userId) {
            return res.status(400).json({ message: "Paramètres manquants : fileId ou userId." });
        }

        const token = jwt.sign(
            { fileId, userId },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.json({ shareLink: `${req.protocol}://${req.get('host')}/api/share/download/${token}` });
    } catch (error) {
        console.error("Erreur lors de la génération du lien de partage :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

// Téléchargement du fichier partagé
router.get('/download/:token', (req, res) => {
    try {
        const { token } = req.params;

        if (!JWT_SECRET) {
            return res.status(500).json({ message: "La configuration du serveur est incorrecte. JWT_SECRET est manquant." });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Erreur de vérification du token :", err);
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Le lien de partage a expiré.' });
                }
                return res.status(401).json({ message: 'Lien de partage invalide.' });
            }

            console.log("Token décodé avec succès :", decoded);
            const { fileId } = decoded;
            const filePath = getFilePath(fileId);

            
            if (!fileId) {
                return res.status(400).json({ message: 'ID de fichier manquant dans le token.' });
            }

           
            res.sendFile(path.resolve(filePath), (err) => {
                if (err) {
                    console.error("Erreur lors de l'envoi du fichier :", err);
                    return res.status(404).json({ message: 'Fichier non trouvé.' });
                }
            });
        });
    } catch (error) {
        console.error("Erreur interne lors du téléchargement :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

export default router;
