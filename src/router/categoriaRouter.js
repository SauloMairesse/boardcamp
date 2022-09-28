import { Router } from "express";
import { validateSchema } from "../middleware/schemaValidation";
import categorySchema from "../schemas/categories";

const categories = Router()

categories.post('/categories', validateSchema(categorySchema), )
categories.get('/categories', )

export default categories