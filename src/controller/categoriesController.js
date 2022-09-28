import db from "../database.js"

async function getCategories (req, res){
    
    try{
        const listCategories = await db.query(`SELECT * FROM categories`)
        
        res.send(listCategories.rows)
    } catch(err){

        return res.send(500)
    }
  }

async function postCategories (req, res){
  const {name} = req.body

  try {
    await db.query(`INSERT INTO categories (name) VALUES ($1)`, [name])  
    
    res.sendStatus(201)
  } catch (err) {

    return res.sendStatus(500)
  }
}

export const categoriesController = {
    getCategories,
    postCategories
}
