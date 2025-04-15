import { Router } from 'express';
import { createNewProduct, getProduct } from '../controllers/product.controller.js';

const productRouter = Router();

// Create a new product
productRouter.post('/', async(req, res) =>{
    createNewProduct(req, res);
});

// For getting a product information
productRouter.get('/:id', async (req, res) =>{
    getProduct(req, res);
});

export default productRouter;