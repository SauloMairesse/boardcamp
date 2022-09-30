import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";
import customersRouter from "./customersRouter.js";
import gameRouter from "./gameRouter.js";

const router = Router()

router.use(categoriesRouter)
router.use(gameRouter)
router.use(customersRouter)

export default router