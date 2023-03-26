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

// PUT /item/:id -- update one item
router.put('/:id', authLockedRoute, async (req,res) =>{
    try{

    // update an existing item
    const updatePost = await db.Post.updateOne( 
        {_id: req.params.id} , 
        { 
            $set: {
            title: req.body.title,
            caption: req.body.caption , 
            picture: req.body.picture , 
            url: req.body.url
            }
        } ,
        //upsert is an update or create command
        {upsert: true, new: true}
    )

    res.json({msg: `user updated item`})

    } catch(err){
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})

//DELETE /:id - deletes an item from items table and the reference in the users table
router.delete('/:id', async (req, res) =>{
    try{
        //get item to delete from items table, need to get info before we delete the table to use in the user table
        const postToDelete = await db.Post.findOne({
            _id: req.params.id
        })
        
        //find user that created the item in the user table
        const getUser = res.locals.user
        // await db.User.findOne({
        //     _id: itemToDelete.userId  
        // })
       
        //update user table to remove one item from user table
        const deleteFromUser = await db.User.updateOne(
            {_id: postToDelete.userId},
            // {_id: itemToDelete.userId},
            {$pull: {items: {$in: [req.params.id]}}}
        )

        //delete entire item from item table
        const deletedpost = await db.Post.findByIdAndDelete(req.params.id)

        res.json('item deleted from items table and from user who created it')
        
    } catch(err){``
        console.log(err)
        res.status(500).json({
            msg: 'internal server error, contact the system administrator'
        })
    }
})