// required packages
const express = require('express')
const router = express.Router()
const db = require('../models')
const authLockedRoute = require('./api-v1/authLockedRoute')

// mount our routes on the router

// GET /:id -- get one item
router.get('/:id', async (req,res) =>{
    try{
        const item = await db.Item.findOne({
            _id: req.params.id
        })
        res.json(item)
    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})