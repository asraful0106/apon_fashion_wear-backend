import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient(); // Initilized prisma client

// Controlers for getting the category from the db
const getCategory = async (req, res) =>{
    try{
        const category = await prisma.category.findMany({});
        res.status(200).send(category);
    }catch(err){
        res.status(500).json({messege : "Internal server error"});
    }
}

// Controlers for creating the category in the db
const creatCetegory = async (req, res) =>{
    // getting the category from the header
    const { category_name, category_image} = req.headers;
    // chacking is all information is given or not
    if(!category_name && !category_image){
        req.status(424).json({message: "All the information is needed!"})
    }

    try{
        const category = await prisma.category.create({
            data:{
                category_name: category_image,
                category_image: category_image
            }
        });

        req.status(201).send(category);
    }catch(err){
        req.status(500).json({message:"Internal server error!"});
    }
}

export { getCategory, creatCetegory };