import { Router } from "express";
import { schemaValidation } from "../middleware/schemaValidation.js";
import customerSchema from "../schemas/customerSchema.js";
import { clientsController } from "../controller/customersController.js";

const clientsRouter = Router()

clientsRouter.post('/clients',   schemaValidation(customerSchema),
                            clientsController.postClients)
clientsRouter.get('/clients', clientsController.getClients)
clientsRouter.get('/clients/:id', clientsController.getClientById)

export default clientsRouter