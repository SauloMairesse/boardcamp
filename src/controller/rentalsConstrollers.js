import db from "../database.js"
import moment from 'moment'

async function getRentals (req, res){
    const {customerId, gameId} = req.query

    try{
        if(customerId){
            const {rows: listByCustomerId} = await db.query(`
                SELECT rentals.*, c.name as "customerName", g.name as "gameName", g."categoryId", ct.name as "categoryName"
                FROM rentals                                    
                JOIN customers as c ON rentals."customerId" = c.id
                JOIN games as g ON rentals."gameId" = g.id      
                JOIN categories as ct ON g."categoryId" = ct.id
                WHERE rentals."customerId" = $1                   
                `, [customerId])
            return res.send( editList(listByCustomerId) )
        }
        if(gameId){
            const {rows: listByGameId} = await db.query(`
                SELECT rentals.*, c.name as "customerName", g.name as "gameName", g."categoryId", ct.name as "categoryName"
                FROM rentals
                JOIN customers as c ON rentals."customerId" = c.id
                JOIN games as g ON rentals."gameId" = g.id 
                JOIN categories as ct ON g."categoryId" = ct.id
                WHERE rentals."gameId" = $1
                `, [gameId])
            return res.send( editList(listByGameId) )
        }

        const {rows: rentalsList} = await db.query(`
            SELECT rentals.*, c.name as "customerName", g.name as "gameName", g."categoryId", ct.name as "categoryName"
            FROM rentals
            JOIN customers as c ON rentals."customerId" = c.id
            JOIN games as g ON rentals."gameId" = g.id 
            JOIN categories as ct ON g."categoryId" = ct.id
            `)

        return res.send( editList(rentalsList) )

    } catch(err){
        if(err.type == 'not found') return res.sendStatus(400)

        return res.sendStatus(500)
    }
  }

async function postRental (req, res){
    const {customerId, gameId, daysRented} = req.body
    
    try {
        // validar customer 
        const {rows: customer} = await db.query(`
            SELECT * FROM customers 
            WHERE customers.id = $1
            `, [customerId])
        if(customer.length  === 0) 
            throw { type: 'not found' }

        //validar gamer 
        const {rows: game} = await db.query(`
            SELECT * FROM games     
            WHERE games.id = $1     
            `, [gameId])
        const {rows: rentedGames} = await db.query(`
            SELECT rentals."gameId"
            FROM rentals
            WHERE rentals."gameId" = $1 
            `, [gameId])
        
        if(game.length  === 0 || game[0].stockTotal == rentedGames.length)
            throw { type: 'not found' }

        //create rental
        const rental = {
            customerId: customerId,
            gameId: gameId,
            rentDate: moment().format(`YYYY-MM-DD`),
            daysRented: daysRented,          
            returnDate: null,      
            originalPrice: game[0].pricePerDay * daysRented, 
            delayFee: null           
        }

        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.returnDate, rental.originalPrice, rental.delayFee])  

        res.sendStatus(201)
    } catch (err) {
        if(err.type == 'not found') return res.sendStatus(400)

        return res.sendStatus(500)
    }
}

async function finishRental (req, res){
    const {id} = req.params

    try {
        const {rows: rental} = await db.query(`
            SELECT * FROM rentals
            WHERE rentals.id = $1
        `, [id])
        if(rental.length === 0){
            throw { type: 'rental not found' }
        }

        if(rental[0].returnDate !== null)
            throw { type: 'rental already finished' }
        
        const returnDate = moment().format(`YYYY-MM-DD`)
        const {rentDate, daysRented, originalPrice} = rental[0]
        
        //calculo preco com atraso
        const delayDays = calcDelay(rentDate)
        const pricePerDay = originalPrice / daysRented
        const delayFee = delayDays * pricePerDay

        await db.query(`
            UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE rentals.id = $3
        `, [returnDate, delayFee, id])
        
        res.sendStatus(200)
    } catch (err) {
        if(err.type == 'rental not found') return res.sendStatus(404)
        if(err.type == 'rental already finished') return res.sendStatus(400)

        console.log(err)
        res.sendStatus(500)
    }

}

async function deleteRental (req, res){
    const {id} = req.params
    try{
        const {rows: rental} = await db.query(`
            SELECT * FROM rentals
            WHERE rentals.id = $1
        `, [id])
        if(rental.length === 0 )
            throw { type: 'not found' }
        if(rental[0].returnDate === null)
            throw { type: 'rent still open' }
        
        //deletando
        await db.query(`
            DELETE FROM rentals 
            WHERE rentals.id = $1;
        `, [id]) 

        return res.sendStatus(200)
    } catch(err){
        if(err.type == 'not found') return res.sendStatus(404)
        if(err.type == 'rent still open') return res.sendStatus(400)

        return res.sendStatus(500)
    }
  }

function calcDelay(rentDate){
    const rentDateEdited = moment(rentDate).format('YYYY-MM-DD')
    const returnDate = moment().format(`YYYY-MM-DD`)

    const diff = moment(returnDate).diff(rentDateEdited)
    const delayDays = moment.duration(diff).asDays()
        
    return delayDays
}

function editList(list){
    const listFormated = list.map((rental) => {

        const {id, customerId, gameId, rentDate, daysRented, 
                returnDate, originalPrice, delayFee, 
                customerName, gameName, categoryId, categoryName} = rental
            return {
                    id: id,
                    customerId: customerId,
                    gameId: gameId,
                    rentDate: moment(rentDate).format('YYYY/MM/DD'),
                    daysRented: daysRented,
                    returnDate: moment(returnDate).format('YYYY/MM/DD'),
                    originalPrice: originalPrice,
                    delayFee: delayFee,
                    customer: {
                    id: customerId,
                    name: customerName
                    },
                    game: {
                    id: gameId,
                    name: gameName,
                    categoryId: categoryId,
                    categoryName: categoryName
                    }
            }
        })
        return listFormated
}

export const rentalsController = {
    getRentals,
    postRental,
    finishRental,
    deleteRental
}
