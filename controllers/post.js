// required packages
const express = require('express')
const router = express.Router()
const db = require('../models')
const authLockedRoute = require('./api-v1/authLockedRoute')

// mount our routes on the router

// GET /:id -- get one post
router.get('/:id', async (req, res) =>{
    try{
        const post = await db.Post.findOne({
            _id: req.params.id
        })
        res.json(post)
    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})

// GET / -- display all items
router.get('/', async (req, res) =>{
    try{
        const post = await db.Post.find()
        res.json(post)
    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})