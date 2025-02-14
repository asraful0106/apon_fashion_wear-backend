import express from 'express';
import categoryRouter from './routes/category.route.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Use express.json() for parsing JSON data
app.use(express.json());
// Use express.urlencoded() for parsing URL-encoded data
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Web app is running!');
});

//All request that come to category will handle by the "categoryRouter"
app.use('/category', categoryRouter);

app.listen(PORT, () => console.log(`App is running at PORT: ${PORT}`));