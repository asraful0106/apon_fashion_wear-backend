import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('Web app is running!');
});

app.listen(PORT, () => console.log(`App is running at PORT: ${PORT}`));