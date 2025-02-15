import express from "express";
import { getImage } from "../controllers/image.controller.js";

const imageRouter = express.Router();

//(GET) To get image and modify it on the fly
imageRouter.get("/:image_name", async(req, res) =>{
    getImage(req, res);
});

export default imageRouter;