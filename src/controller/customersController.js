import db from "../database.js"

async function getCustomers (req, res){
    const {cpf} = req.query

    try{
        if(cpf){
            const customerByCpf = await db.query(`
            SELECT * FROM customers WHERE cpf LIKE $1`,
            [cpf])

            if(customerByCpf.rows.length === 0) throw { type: 'not found' }
            res.send(customerByCpf.rows)
        }

        const clientsList = await db.query(`SELECT * FROM customers`)
        res.send(clientsList.rows)

    } catch(err){

        return res.send(500)
    }
  }

async function getCustomersById (req, res){
    const {id} = req.params

    try{
        const customerById = await db.query(`
        SELECT * FROM customers WHERE id = $1`,
        [id])

        if(customerById.rows.length === 0) throw { type: 'not found' }

        res.send(customerById.rows[0])
    } catch(err){
        return res.send(500)
    }
}

async function postCustomer (req, res){
    const {name, phone, cpf, birthday} = req.body
    try {
        //validar cpf 
        const isThereCpf = await db.query(`
                            SELECT * FROM customers 
                            WHERE cpf = $1
                            `, [cpf])
        if(isThereCpf.rows.length  !== 0) 
            throw { type: 'cpf error' }

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday])  
    
        res.sendStatus(201)
    } catch (err) {
        if(err.type == 'cpf error') return res.sendStatus(409)

        return res.sendStatus(500)
    }
}

async function putCustomer (req, res){
    const {name, phone, cpf, birthday} = req.body
    console.log(' \n cpf : ', cpf, '\n')
    const {id} = req.params
    try {
        //validar cpf 
        const {rows: userInDB} = await db.query(`
                            SELECT * FROM customers 
                            WHERE cpf = $1
                            `, [cpf])
        
        if(userInDB[0].cpf !== cpf && userInDB.length !== 0 )   
            throw { type: 'cpf error' }

        await db.query(`
            UPDATE customers
            SET name = $1, phone = $2, cpf = $4, birthday = $4
            WHERE customers.id = $5`,
            [name, phone, cpf, birthday, id])  
    
        res.sendStatus(201)
    } catch (err) {
        if(err.type == 'cpf error') return res.sendStatus(409)
        console.log(err)
        return res.sendStatus(500)
    }
}

export const customersController = {
    getCustomers,
    getCustomersById,
    postCustomer,
    putCustomer
}
