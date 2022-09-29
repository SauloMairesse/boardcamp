import db from "../database.js"

async function getGames(req, res){
    try{
        const listGames = await db.query(`SELECT * FROM games`)
        
        res.send(listGames.rows)
    } catch(err){

        return res.send(500)
    }
  }

async function postGames (req, res){
    const {name, image, categoryId, stockTotal, pricePerDay} = req.body
    
    const nameVerify = name.replace(" ", "")
    
    try {
        if(stockTotal <= 0 || pricePerDay <= 0 || nameVerify.length === 0)
            throw{ type: 'greater than zero'}

        const gameExisting = await db.query(`SELECT * FROM games WHERE name = $1`,
                                            [name])
        if(gameExisting.rows.length !== 0)
            throw{ type: 'game already Exist'}

        const category = await db.query(`SELECT * FROM categories WHERE id = $1`,
                                        [categoryId])    
        console.log(category.rows)
        if(category.rows.length === 0)
            throw{ type: 'id of Category must exist'}

        await db.query(`INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") 
                        VALUES ($1, $2, $3, $4, $5)`, 
                        [name, image, stockTotal, categoryId, pricePerDay])

        res.sendStatus(201)
    } catch (err) {
        if(err.type === 'greater than zero' || err.type === 'id of Category must exist'){
            return res.sendStatus(400)
        }
        if(err.type == 'game already Exist'){
            return res.sendStatus(409)
        }

        console.log(err)
        return res.sendStatus(500)
  }
}

export const gamesController = {
    getGames,
    postGames
}
