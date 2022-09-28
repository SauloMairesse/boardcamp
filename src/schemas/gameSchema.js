import Joi from "joi";

const gameSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    stockTotal: Joi.number().integer().options({ convert: false }).required(),
    categoryId:Joi.number().integer().options({ convert: false }).required(),
    pricePerDay: Joi.number().integer().options({ convert: false }).required()
})

export default gameSchema