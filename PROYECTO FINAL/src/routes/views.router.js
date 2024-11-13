import { Router } from "express";
import ProductModel from "../models/product.model.js";
import CartManager from "../managers/cart-manager-db.js";
const router = Router();
const cartManager = new CartManager();

// Ruta para visualizar productos con paginación
router.get("/products", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    try {
        const productos = await ProductModel.paginate({}, { page, limit, lean: true });

        res.render("home", {
            productos: productos.docs,
            pagination: {
                totalPages: productos.totalPages,
                currentPage: productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage
            }
        });
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta para visualizar un carrito específico
router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await cartManager.getCarritoById(cartId);

        if (!carrito) {
            console.log("No existe ese carrito con el id");
            return res.status(404).render("error", { errorMessage: "Carrito no encontrado" });
        }

        const productosEnCarrito = carrito.products.map(item => ({
            product: item.product.toObject(),
            quantity: item.quantity
        }));

        res.render("carts", { productos: productosEnCarrito });
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).render("error", { errorMessage: "Error al obtener el carrito" });
    }
});

export default router;
