import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

// Initilized prisma client
const prisma = new PrismaClient();

// Get current directory path using ES module method
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// Ensure the upload directory exists
fse.ensureDirSync(uploadDir);
// Configure multer to store files in the upload directory
const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Funtion to get all banner
const getBanner = async (req, res) => {
    try {
        const banner = await prisma.banner.findMany({});
        res.status(200).send(banner);
    } catch (err) {
        res.status(500).json({ messege: "Internal server error!" });
    }
}

// Funtion to upload imgae to the banner table
const createBanner = async (req, res) => {
    upload.single('banner_image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed!", error: err });
        }
        if (!req.file) {
            return res.status(400).json({ messege: "No file uploaded!" });
        }

        // getting the category from the header
        const { banner_image } = req.body;

        const image_path = req.file.filename;

        try {
            const banner = await prisma.banner.create({
                data: {
                    banner_image: image_path
                }
            });
            res.status(201).json({ banner });
        } catch (err) {
            res.status(500).json({ messege: "Internal server error!" });
        }
    });

}

export { createBanner, getBanner };