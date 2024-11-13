import express from "express";
import ProductManager from "../managers/product-manager-db.js"; // Cambiado a product-manager-db.js
const manager = new ProductManager();
const router = express.Router();

// Ruta GET / con parámetros opcionales para paginación, límite, orden y búsqueda
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query
        };

        const productos = await manager.getProducts(options);

        res.json(productos);
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta GET /:pid para obtener un producto específico por su ID
router.get("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        const productoBuscado = await manager.getProductById(id);

        if (!productoBuscado) {
            res.status(404).send("Producto no encontrado");
        } else {
            res.json(productoBuscado);
        }
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
});

// Ruta POST / para agregar un nuevo producto
router.post("/", async (req, res) => {
    const nuevoProducto = req.body;

    try {
        await manager.addProduct(nuevoProducto);
        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        res.status(500).send("Error al agregar el producto");
    }
});

// Ruta DELETE /:pid para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    let id = req.params.pid;

    try {
        await manager.deleteProduct(id);
        res.send("Producto eliminado");
    } catch (error) {
        res.status(500).send("Error al querer borrar un producto");
    }
});

export default router;
