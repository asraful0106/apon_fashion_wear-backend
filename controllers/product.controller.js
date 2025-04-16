import { PrismaClient } from '@prisma/client';
import crypto from 'crypto'; // For fixed length uuid

const prisma = new PrismaClient();

// For getting the product details GET request
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

// create product POST request
const createNewProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        offer_price, // otpional
        accept_preorder, // optional
        is_fetured,  // optional
        category_id,
        sub_category_id,  // optional
        colors, // Arrays of colors with images and inventories
    } = req.body;

    // Fixed Length UUID for product
    const product_id = crypto.randomBytes(10).toString('hex');

    if (!name, !description, !price, !category_id, !colors) {
        return res.status(400).json({ "message": "Please fill all the fields!" });
    }

    try {
        const newProduct = await prisma.product.create({
            data: {
                product_id,
                name,
                description,
                price,
                offer_price: offer_price ?? null,
                accept_preorder: accept_preorder ?? false,
                is_fetured: is_fetured ?? false,
                category_id,
                sub_category_id: sub_category_id ?? null,
                colors: {
                    create: colors.map((color) => ({
                        name: color.name,
                        images: {
                            create: color.images?.map((image) => ({
                                image_url: image.url,
                            })) || [], // Handle case where images might be empty
                        },
                        inventories: {
                            create: color.inventories?.map((inventory) => ({
                                product_quantity: inventory.quantity,
                                size: {
                                    connect: { size_id: inventory.size_id },
                                },
                            })) || [], // Handle case where inventories might be empty
                        },
                    })),
                },
            },
            include: {
                category: {
                    select: { category_name: true },
                },
                subCategory: {
                    select: { sub_category_name: true },
                },
                colors: {
                    include: {
                        images: true,
                        inventories: {
                            include: {
                                size: {
                                    select: { size_id: true, name: true },
                                },
                            },
                        },
                    },
                },
            },
        });
        res.status(201).json(newProduct);
    } catch (err) {
        console.error("Product Creating Error: ", err);
        res.status(500).json({ message: "Internal Server Error!" });
    }


}

export { getProduct, createNewProduct };