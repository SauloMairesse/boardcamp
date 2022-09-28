import { Router } from "express";
import { schemaValidation } from "../middleware/schemaValidation.js";
import categorySchema from "../schemas/categories.js";
import {categoriesController} from "../controller/categoriesController.js"

const categoriesRouter = Router()

categoriesRouter.post('/categories',  schemaValidation(categorySchema), 
                                categoriesController.postCategories)
categoriesRouter.get('/categories', categoriesController.getCategories)

export default categoriesRouter