import Joi from "joi";

// const rentalSchema = Joi.object({
//     id: Joi.number()
//         .integer()
//         .greater(0)
//         .required(),
//     customerId: Joi.number()
//         .integer()
//         .greater(0)
//         .required(),
//     gameId: Joi.number()
//         .integer()
//         .greater(0)
//         .required(),
//     rentDate: Joi.string()
//         .pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)
//         .required(),
//     daysRented: Joi.number()
//         .integer()
//         .greater(0)
//         .required(),            
//     returnDate: null,          
//     originalPrice: Joi.number()
//         .integer()
//         .greater(0)
//         .required(),      
//     delayFee: null     
//   })

const rentalSchema = Joi.object({

    customerId: Joi.number()
        .integer()
        .greater(0)
        .required(),
    gameId: Joi.number()
        .integer()
        .greater(0)
        .required(),
    daysRented: Joi.number()
        .integer()
        .greater(0)
        .required()
  })

export default rentalSchema