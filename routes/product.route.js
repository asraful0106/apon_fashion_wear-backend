import { Router } from 'express';
import { createNewProduct, deleteProduct, getProduct, updateProduct } from '../controllers/product.controller.js';

const productRouter = Router();

// Create a new product
productRouter.post('/', async (req, res) => {
    createNewProduct(req, res);
});

// For delete a product
productRouter.delete('/', async (req, res) => {
    deleteProduct(req, res);
});

// For getting a product information
productRouter.get('/:id', async (req, res) => {
    getProduct(req, res);
});

// For update all product information
productRouter.patch('/:id', async (req, res) => {
    updateProduct(req, res);
});

export default productRouter;