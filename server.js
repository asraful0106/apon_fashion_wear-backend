import express from 'express';
import categoryRouter from './routes/category.route.js';
import imageRouter from './routes/image.route.js';
import cleanupCache from './job/cache_cleanup.js';
import bannerRouter from './routes/banner.route.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Use express.json() for parsing JSON data
app.use(express.json());
// Use express.urlencoded() for parsing URL-encoded data
app.use(express.urlencoded({ extended: false }));
// CORS policy
app.use(cors());

app.get('/', (req, res) => {
    res.send('Web app is running!');
});

//All request that come to "category" will handle by the "categoryRouter"
app.use('/category', categoryRouter);
// All request that come to "banner" will handle by the "bannerRouter"
app.use('/banner', bannerRouter);
// All request that come to "image" will handle by the "imageRouter"
app.use('/image', imageRouter);


// Clean up work
cleanupCache();
app.listen(PORT, () => console.log(`App is running at PORT: ${PORT}`));