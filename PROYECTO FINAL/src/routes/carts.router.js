import express from "express";
import CartManager from "../managers/cart-manager-db.js";
const manager = new CartManager();
const router = express.Router();

// 1) Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).send("Error al crear el carrito");
    }
});

// 2) Listar los productos que pertenecen a un carrito específico con `populate`
router.get("/cart/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carrito = await manager.getCarritoById(cartId);

        if (!carrito) {
            console.log("Carrito no encontrado");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(carrito.products);
    } catch (error) {
        console.error("Error al obtener el carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 3) Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await manager.agregarProductoAlCarrito(cartId, productId, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        res.status(500).send("Error al agregar productos al carrito");
    }
});

// 4) Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const carritoActualizado = await manager.eliminarProductoDelCarrito(cartId, productId);
        res.json(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al eliminar el producto del carrito");
    }
});

// 5) Actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;

    try {
        const carritoActualizado = await manager.actualizarCarrito(cartId, updatedProducts);
        res.json(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al actualizar el carrito");
    }
});

// 6) Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const nuevaCantidad = req.body.quantity;

    try {
        const carritoActualizado = await manager.actualizarCantidadProducto(cartId, productId, nuevaCantidad);
        res.json(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al actualizar la cantidad del producto en el carrito");
    }
});

// 7) Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const carritoActualizado = await manager.eliminarTodosLosProductosDelCarrito(cartId);
        res.json(carritoActualizado.products);
    } catch (error) {
        res.status(500).send("Error al eliminar todos los productos del carrito");
    }
});

export default router
