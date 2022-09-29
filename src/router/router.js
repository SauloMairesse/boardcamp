import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";
import clientsRouter from "./clientsRouter.js";
import gameRouter from "./gameRouter.js";

const router = Router()

router.use(categoriesRouter)
router.use(gameRouter)
router.use(clientsRouter)

export default router