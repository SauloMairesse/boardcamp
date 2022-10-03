import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";
import customersRouter from "./customersRouter.js";
import gameRouter from "./gameRouter.js";
import rentalsRouter from "./rentalsRouters.js";

const router = Router()

router.use(categoriesRouter)
router.use(gameRouter)
router.use(customersRouter)
router.use(rentalsRouter)

export default router