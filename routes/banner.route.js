import express from 'express';
import { createBanner, getBanner } from '../controllers/banner.controller.js';

const bannerRouter = express.Router();

// Route to get all banner
bannerRouter.get('/', async (req, res) => {
    getBanner(req, res);
});
// Route to create a new banner
bannerRouter.post('/', async (req, res) => {
    createBanner(req, res);
});

export default bannerRouter;