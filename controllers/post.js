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

// POST /post/new -- create one post 
router.post('/new', authLockedRoute, async (req,res) =>{
    try{
        // find user
        const existingUser = res.locals.user

    // creates a new item
    const newPost = await db.Item.findOneAndUpdate( 
        {title: req.body.title} ,
        {caption: req.body.caption , 
        picture: req.body.picture , 
        url: req.body.url } ,
        //upsert is an update or create command
        {upsert: true, new: true}
    )

    //associates user with item
    existingUser.post.push(newPost._id)
    await existingUser.save()

    // associates item with a user
    newPost.userId = existingUser._id
    await newPost.save()

    res.json({msg: 'user created item'})

    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})