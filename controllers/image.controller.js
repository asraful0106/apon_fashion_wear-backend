import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fse from "fs-extra";

// Get current directory path using ES module method
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "uploads");
const cacheDir = path.join(__dirname, "cache_memory");

// Ensure the directories exist
fse.ensureDirSync(uploadsDir);
fse.ensureDirSync(cacheDir);

// Configure Multer for file upload
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Handle file upload
const imageUpload = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        return res.status(201).json({
            message: "File uploaded successfully",
            filePath: `/uploads/${req.file.filename}`
        });
    });
};

export { imageUpload };
