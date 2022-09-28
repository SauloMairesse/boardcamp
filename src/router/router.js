import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";
import gameRouter from "./gameRouter.js";

const router = Router()

router.use(categoriesRouter)
router.use(gameRouter)

export default router