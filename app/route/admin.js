import express from "express";

export function getAdminRoutes() {
    const router = express.Router()

    router.use((req, res, next) => {
        // Vérifier que le type est admin...
        try {
            next()
        } catch (e) {
             console.warn(e)
        }
    })

    router.get('/user', (req, res, next) => {
        res.json({
            message: "Des users depuis l'admin"
        })
    })

    return router
}
