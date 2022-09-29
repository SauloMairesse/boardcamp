import Joi from "joi"

const customerSchema = Joi.object({
    name: Joi.string()
        .required(),
    phone: Joi.string()
        .min(10)
        .max(11)
        .pattern(/^[0-9]+$/)
        .required(),
    cpf: Joi.string()
        .length(11)
        .pattern(/^[0-9]+$/)
        .required(),
    birthday: Joi.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
        .required()
})

export default customerSchema