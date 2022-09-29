import db from "../database.js"
import { validate } from 'gerador-validador-cpf'

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
    const validCpf = validate(cpf)
    
    try {
        if(!validCpf) throw { type: 'cpf invalido'}
        const isThereCpf = await db.query(`
            SELECT * FROM customers 
            WHERE cpf = $1
        `, [cpf])
        if(isThereCpf.rows.length  !== 0) 
            throw { type: 'cpf already existe' }

        await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday) 
            VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday])  
    
        res.sendStatus(201)
    } catch (err) {

        return res.sendStatus(500)
    }
}

export const customersController = {
    getCustomers,
    getCustomersById,
    postCustomer
}
