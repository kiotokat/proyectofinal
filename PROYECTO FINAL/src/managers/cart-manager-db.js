import CartModel from "../models/cart.model.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear el carrito", error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId).populate("products.product");
            return carrito || null;
        } catch (error) {
            console.log("Error al obtener el carrito", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.log("Error al agregar un producto al carrito", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito", error);
            throw error;
        }
    }

    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = updatedProducts;
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar el carrito", error);
            throw error;
        }
    }

    async actualizarCantidadProducto(cartId, productId, nuevaCantidad) {
        try {
            const carrito = await this.getCarritoById(cartId);
            if (!carrito) throw new Error("Carrito no encontrado");

            const producto = carrito.products.find(item => item.product.toString() === productId);
            if (!producto) throw new Error("Producto no encontrado en el carrito");

            producto.quantity = nuevaCantidad;
            carrito.markModified("products");
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto en el carrito", error);
            throw error;
        }
    }

    async eliminarTodosLosProductosDelCarrito(cartId) {
        try {
            const carrito = await CartModel.findById(cartId);
            if (!carrito) throw new Error("Carrito no encontrado");

            carrito.products = [];
            await carrito.save();
            return carrito;
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito", error);
            throw error;
        }
    }
}

export default CartManager;
