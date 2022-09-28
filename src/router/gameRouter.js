import { Router } from "express";
import { schemaValidation } from "../middleware/schemaValidation.js";
import gameSchema from "../schemas/gameSchema.js";
import { gamesController } from "../controller/gameController.js";

const gameRouter = Router()

gameRouter.post('/games',  schemaValidation(gameSchema), 
                            gamesController.postGames)
gameRouter.get('/games', gamesController.getGames)

export default gameRouter