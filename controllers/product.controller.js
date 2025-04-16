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

// Product Update API
const updateProduct = async (req, res) => {
    const { product_id } = req.params;
    if (!product_id) {
        return res.status(404).json({ message: "Product id is required!" });
    }
    const { name, description, price, offer_price, accept_preorder, is_fetured, category_id, sub_category_id, colors } = req.body;

    if (!name, !description, !price, !category_id, !colors) {
        return res.status(404).json({ "message": "Please fill all the fields!" });
    }

    try {
        const existingProduct = await prisma.product.findUnique({
            where: { product_id },
        });

        if (!existingProduct) {
            return res.status(404).json({ messgae: "Product not found" });
        }
        // Validate input if provided
        if (colors && (!Array.isArray(colors) || colors.length === 0)) {
            return res.status(400).json({ message: 'Colors must be a non-empty array' });
        }

        // Validate category_id if provided
        if (category_id !== undefined) {
            const categoryExists = await prisma.category.findUnique({
                where: { category_id },
            });
            if (!categoryExists) {
                return res.status(400).json({ message: 'Invalid category_id' });
            }
        }

        // Validate sub_category_id if provided and not null
        if (sub_category_id !== undefined && sub_category_id !== null) {
            const subCategoryExists = await prisma.subCategory.findUnique({
                where: { sub_category_id },
            });
            if (!subCategoryExists) {
                return res.status(400).json({ message: 'Invalid sub_category_id' });
            }
        }

        // Validate size_id for inventories if colors are provided
        if (colors) {
            for (const color of colors) {
                if (!color.name) {
                    return res.status(400).json({ message: 'Each color must have a name' });
                }
                for (const inventory of color.inventories || []) {
                    const sizeExists = await prisma.size.findUnique({
                        where: { size_id: inventory.size_id },
                    });
                    if (!sizeExists) {
                        return res.status(400).json({ message: `Invalid size_id: ${inventory.size_id}` });
                    }
                    if (inventory.quantity < 0) {
                        return res.status(400).json({ message: 'Inventory quantity cannot be negative' });
                    }
                }
            }
        }

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { product_id },
            data: {
                name: name !== undefined ? name : existingProduct.name,
                description: description !== undefined ? description : existingProduct.description,
                price: price !== undefined ? price : existingProduct.price,
                offer_price: offer_price !== undefined ? offer_price : existingProduct.offer_price,
                accept_preorder: accept_preorder !== undefined ? accept_preorder : existingProduct.accept_preorder,
                is_fetured: is_fetured !== undefined ? is_fetured : existingProduct.is_fetured,
                category_id: category_id !== undefined ? category_id : existingProduct.category_id,
                sub_category_id: sub_category_id !== undefined ? sub_category_id : existingProduct.sub_category_id,
                ...(colors && {
                    colors: {
                        // Delete existing colors and their related images and inventories
                        deleteMany: {},
                        // Create new colors
                        create: colors?.map((color) => ({
                            name: color?.name,
                            images: {
                                create: color?.images?.map((image) => ({
                                    image_url: image?.url,
                                })) || [],
                            },
                            inventories: {
                                create: color?.inventories?.map((inventory) => ({
                                    product_quantity: inventory?.quantity,
                                    size: {
                                        connect: { size_id: inventory?.size_id },
                                    },
                                })) || [],
                            },
                        })),
                    },
                }),
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


    } catch (err) {
        console.error('Product Update Error: ', err);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
}

// Product Delete API
const deleteProduct = async (req, res) => {
    const { product_id } = req.body;
    if (!product_id) {
        return res.status(404).json({ message: "Product Id is required!" });
    }

    try {
        const existingProduct = await prisma.product.findUnique({
            where: { product_id },
        });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found!" });
        }
        // Delete the product (related colors, images, inventories, and reviews are handled by cascading deletes)
        await prisma.product.delete({
            where: { product_id },
        });
        res.status(204).json({ message: "Product deleted successfully!" });
    } catch (err) {
        console.error('Product Delete Error: ', err);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
}

export { getProduct, createNewProduct, updateProduct, deleteProduct };