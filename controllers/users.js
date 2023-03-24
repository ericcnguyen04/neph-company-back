// required packages
const router = require('express').Router()
// database
const bcrypt = require('bcryptjs') // method to hash and compare passwords
const jwt = require('jsonwebtoken') // used for authentication and authorization

// !! === CRUD === !! //

// GET /users - test endpoint
router.get('/', (req, res) => {
    res.json({ msg: 'welcome to the users endpoint' })
})

// export
module.exports = router