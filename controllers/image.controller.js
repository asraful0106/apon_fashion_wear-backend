import path from "path";
import { fileURLToPath } from 'url';
import fse from "fs-extra";
import sharp from "sharp";

// Get current directory path using ES module method
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const cacheDir = path.join(__dirname, '..', 'public', 'cache_memory');

// Ensure the directories exist
fse.ensureDirSync(uploadsDir);
fse.ensureDirSync(cacheDir);

const getImage = async (req, res) => {
    const { image_name } = req.params;
    // Validate image_name to Avoid Directory Traversal
    if (image_name.includes("..") || image_name.includes("/")) {
        return res.status(400).json({ message: "Invalid filename!" });
    }
    const { width, height, format, qulity } = req.query;

    const widthNum = width ? parseInt(width) : null;
    const heightNum = height ? parseInt(height) : null;
    const qulityNum = qulity ? parseInt(qulity) : null;
    const qualityValue = qulityNum && qulityNum >= 1 && qulityNum <= 100 ? qulityNum : 100;

    // Supported formats
    const supportedFormats = ["jpeg", "png", "webp", "avif"];
    const outputFormat = supportedFormats.includes(format) ? format : "webp";

    const cacheImageName = image_name.slice(0, image_name.lastIndexOf('.'));
    const originalPath = path.join(uploadsDir, image_name);

    // Build cache filename dynamically
    let cacheFileName = `${cacheImageName}`;
    if (widthNum) cacheFileName += `-w${widthNum}`;
    if (heightNum) cacheFileName += `-h${heightNum}`;
    if (qulityNum) cacheFileName += `-q${qualityValue}`;
    cacheFileName += `.${outputFormat}`;

    const cachePath = path.join(cacheDir, cacheFileName);

    const mimeTypes = {
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg', // Ensure both .jpeg and .jpg are covered
        'png': 'image/png',
        'webp': 'image/webp',
        'avif': 'image/avif'
    };
    const contentType = mimeTypes[outputFormat] || 'image/webp';

    // Serve cached file immediately if it exists
    if (fse.existsSync(cachePath)) {
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');
        return fse.createReadStream(cachePath).pipe(res);
    }

    // If original file doesn't exist
    if (!fse.existsSync(originalPath)) {
        return res.status(404).json({ message: "File not found!" });
    }

    // Serve original file if no modifications requested
    if (!widthNum && !heightNum && !qulityNum) {
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');
        return fse.createReadStream(originalPath).pipe(res);
    }

    try {
        let image = sharp(originalPath);

        if (widthNum || heightNum) {
            image = image.resize(widthNum, heightNum);
        }

        if (outputFormat === "jpeg") {
            image = image.jpeg({ quality: qualityValue });
        } else if (outputFormat === "png") {
            image = image.png({ quality: qualityValue });
        } else if (outputFormat === "webp") {
            image = image.webp({ quality: qualityValue });
        } else if (outputFormat === "avif") {
            image = image.avif({ quality: qualityValue });
        }

        // Save to cache before serving
        await image.toFile(cachePath);

        // Serve processed image
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', 'inline');
        return fse.createReadStream(cachePath).pipe(res);
    } catch (err) {
        console.error("Error processing image:", err);
        return res.status(500).json({ message: "Error processing image" });
    }
};


export { getImage };
