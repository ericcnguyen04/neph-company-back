// required packages
const router = require('express').Router()
const db = require('../models') // database
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
        const findUser = await db

    } catch(err) {
        console.log(err)
        res.status(500).json({ msg: 'server error' })
    }
})

// export
module.exports = router