import { PrismaClient } from '@prisma/client';
import crypto from 'crypto'; // For fixed length uuid

const prisma = new PrismaClient();

// For getting the product details
const getProduct = async (req, res) => {
    const product_id = req.params.id;
    if (!product_id) {
        return res.status(404).json({ "messege: ": "Product id is required!" });
    }

    try {
        const product = await prisma.product.findUnique({
            where: { product_id: product_id },
            include: {
                category: {
                    select: { category_name: true },
                },
                subCategory: {
                    select: { subCategory_name: true },
                },
                colors: {
                    include: {
                        images: {
                            select: { image_id: true, image_url: true },
                        },
                        inventories: {
                            include: {
                                size: {
                                    select: { size_id: true, name: true },
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!product) {
            return res.status(404).json({ "message": "Product not found!" });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error("Product Getting Error: ", err);
        res.status(500).json({ messgae: "Internal Server Error!" });
    }
}

// create product
const createNewProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        category_id,
        sub_category_id,
    } = req.body;

    // Fixed Length UUID for product
    const product_id = crypto.randomBytes(10).toString('hex');

    if (!name, !description, !price, !category_id) {
        return res.status(400).json({ "message": "Please fill all the fields!" });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                product_id,
                name,
                description,
                price,
                category_id,
                sub_category_id: sub_category_id ?? null
            }
        });
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Product Creating Error: ", err);
        res.status(500).json({ message: "Internal Server Error!" });
    }


}

export { getProduct, createNewProduct };