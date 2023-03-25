// required packages
const router = require('express').Router()
const db = require('../models/api-v1') // database
const bcrypt = require('bcryptjs') // method to hash and compare passwords
const jwt = require('jsonwebtoken') // used for authentication and authorization

// !! === CRUD === !! //

// GET /users - test endpoint
router.get('/', (req, res) => {
    res.json({ msg: 'welcome to the users endpoint' })
})

// POST /users/register - create a new user
router.post('/register', async (req, res) => {
    try {
        // checking if user exist already
        const findUser = await db.User.findOne({
            email: req.body.email
        })

        // don't allow emails to register twice
        if (findUder) return res.status(400).json({ msg: 'email exists already' })

        // hashing password
        const password = req.body.password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        // create new user
        const newUser = new db.User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        await newUser.save()

        // create jwt payload
        const payload = {
            username: newUser.username,
            email: newUser.email,
            id: newUser.id
        }

        // sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET)

        res.json({ token })

    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'server error' })
    }
})

// POST /users/login -- validating login credentials
router.post('/login', async (req, res) => {
    try {
        // try to find user in the db
        const foundUser = await db.User.findOne({
            email: req.body.email
        })

        // message for incorrect login
        const noLoginMessage = 'Incorrect username or password'

        // if user not found in db, return and send status 400 w/ message
        if(!foundUser) return res.status(400).json({ msg: noLoginMessage })

        // compare the password from the req body to the password in db 
        const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)

        // if provided password doesn't match, return noLoginMessage
        if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage})

        // create jwt payload
        const payload = {
            username: foundUser.username,
            email: foundUser.email,
            id: foundUser.id
        }

        // sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET)

        res.json({ token })

    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'server error' })
    }
})

// export
module.exports = router