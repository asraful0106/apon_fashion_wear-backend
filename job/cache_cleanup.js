import path from "path";
import { fileURLToPath } from 'url';
import fse from "fs-extra";

// Get current directory path using ES module method
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cacheDir = path.join(__dirname, '..', 'public', 'cache_memory');

// Ensure the directories exist
fse.ensureDirSync(cacheDir);

// Automatic Cache Cleanup (Limits Cache Size)
const CACHE_LIMIT_MB = 1500; // Set max cache size (adjust as needed)
const cleanupCache = () => {
    fse.readdir(cacheDir, (err, files) => {
        if (err) return;
        console.log("Working");
        let totalSize = 0;
        const filePaths = files.map(file => path.join(cacheDir, file));

        filePaths.forEach(file => {
            totalSize += fse.statSync(file).size;
        });

        if (totalSize > CACHE_LIMIT_MB * 1024 * 1024) {
            filePaths.sort((a, b) => fse.statSync(a).mtime - fse.statSync(b).mtime); // Sort by oldest first
            while (totalSize > CACHE_LIMIT_MB * 1024 * 1024 && filePaths.length > 0) {
                const oldestFile = filePaths.shift();
                totalSize -= fs.statSync(oldestFile).size;
                fs.unlinkSync(oldestFile);
            }
        }
    });
};

// Run cache cleanup every hour
setInterval(cleanupCache, 24 * 60 * 60 * 1000);

export default cleanupCache;