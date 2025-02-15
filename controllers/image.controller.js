import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import fse from "fs-extra";

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
    const { width, height, format, qulity } = req.query;

    const widthNum = width? parseInt(width) : null;
    const heightNum = height ? parseInt(height) : null;
    const qulityNum = qulity ? parseInt(qulity) : null;

    const supportedFormats = ["jpeg", "png", "webp", "avif"];
    const outputFormat = supportedFormats.includes(format) ? format : "webp";

    const originalPath = path.join(uploadsDir, image_name);
    const cachePath = path.join(cacheDir, image_name);

    const mimeTypes = {
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg', // Ensure both .jpeg and .jpg are covered
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.avif': 'image/avif'
    };
    // Extracting the file extension from the filename
    const fileExtension = image_name.slice(image_name.lastIndexOf('.')); // Extracts ".webp"
    const contentType = mimeTypes[fileExtension];

    // if file is not found
    if(!fse.existsSync(originalPath)){
        return res.status(404).json({message: "File is not found!"});
    }

    // In case user try to get the exact file
    if(widthNum == null && heightNum == null && qulityNum == null){
        res.setHeader('Content-type', contentType);
        res.setHeader('Content-Disposition', 'inline'); // Makes sure the image is displayed in the browser (not downloaded)
        return fse.createReadStream(originalPath).pipe(res);
    }


}

export { getImage };
