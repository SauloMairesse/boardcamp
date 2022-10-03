import { Router } from "express";
import { rentalsController } from "../controller/rentalsConstrollers.js";
import { schemaValidation } from "../middleware/schemaValidation.js";
import rentalSchema from "../schemas/rentalSchema.js";

const rentalsRouter = Router()

rentalsRouter.post('/rentals',  schemaValidation(rentalSchema), 
                                rentalsController.postRental)
rentalsRouter.get('/rentals', rentalsController.getRentals)
rentalsRouter.post('/rentals/:id/return', rentalsController.finishRental)
rentalsRouter.delete('/rentals/:id', rentalsController.deleteRental)

export default rentalsRouter