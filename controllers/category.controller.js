import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fse from "fs-extra";


const prisma = new PrismaClient(); // Initilized prisma client

// Get current directory path using ES module method
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');


// Ensure the directories exist
fse.ensureDirSync(uploadsDir);

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


//(GET) Controlers for getting the category from the db
const getCategory = async (req, res) => {
    try {
        const category = await prisma.category.findMany({
            include:{
                sub_categories:true // Load related subCategoies
            }
        });
        res.status(200).send(category);
    } catch (err) {
        console.log(err);
        res.status(500).json({ messege: "Internal server error" });
    }
}

//(POST) Controlers for creating the category in the db
const creatCetegory = async (req, res) => {
    upload.single('category_image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // getting the category from the header
        const { category_name } = req.body;
        // chacking is all information is given or not
        if (!category_name) {
            res.status(424).json({ message: "All the information is needed!" })
        }

        // const image_path = `/uploads/${req.file.filename}`;
        const image_path = req.file.filename;

        try {
            const category = await prisma.category.create({
                data: {
                    category_name: category_name,
                    category_image: image_path
                }
            });

            res.status(201).json({category}); 
        } catch (err) {
            res.status(500).json({ message: "Internal server error!" });
        }
    });
}

const createSubCategory = async(req, res) =>{
    upload.single('sub_category_image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // getting the sub-category from the header 
        const { sub_category_name, category_id } = req.body;
        // chacking is all information is given or not
        if (!sub_category_name && !category_id) {
            res.status(424).json({ message: "All the information is needed!" })
        }

        //getting the iamge path
        const image_path = req.file.filename;

        try {
            const subCategory = await prisma.subCategory.create({
                data: {
                    category_id: parseInt(category_id),
                    sub_category_name,
                    sub_category_image: image_path
                }
            });

            res.status(201).send(subCategory);
        } catch (err) {
            res.status(400).json({ message: "Category not found!" });
        }
    })
}

export { getCategory, creatCetegory, createSubCategory };