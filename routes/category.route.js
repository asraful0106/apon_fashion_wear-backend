import express from "express";
import { getCategory, creatCetegory, createSubCategory } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

// this route is for gettting the all category and sub-category from the DB
categoryRouter.get("/",async(req, res) =>{
    getCategory(req, res);
});

// this route is for creating the category
categoryRouter.post("/", async(req, res) =>{
    creatCetegory(req, res);
});

// this route is for creating sub categorys
categoryRouter.post("/sub-category", async(req, res) =>{
    createSubCategory(req, res);
});

export default categoryRouter;