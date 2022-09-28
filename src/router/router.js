import { Router } from "express";
import categoriesRouter from "./categoriaRouter.js";

const router = Router()

router.use(categoriesRouter)

export default router