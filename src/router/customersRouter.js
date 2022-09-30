import { Router } from "express";
import { schemaValidation } from "../middleware/schemaValidation.js";
import customerSchema from "../schemas/customerSchema.js";
import { customersController } from "../controller/customersController.js";

const customersRouter = Router()

customersRouter.post('/customers',  schemaValidation(customerSchema),
                                customersController.postCustomer)
customersRouter.put('/customers/:id',  schemaValidation(customerSchema),
                                customersController.putCustomer)
customersRouter.get('/customers', customersController.getCustomers)
customersRouter.get('/customers/:id', customersController.getCustomersById)

export default customersRouter