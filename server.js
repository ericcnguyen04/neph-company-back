// step 1: setting up express.js to handle HTTP req and res
const express = require('express')
const cors = require('cors') // security feature
const rowdy = require('rowdy-logger') // optional: for developer experience

// step 2: configure express app
const app = express()
const PORT = process.env.PORT || 3000

// for debug logging
const rowdyResults = rowdy.begin(app)

app.use(cors())


// =======================

app.get('/', (req, res) => {
    res.send('Hello World')
})


// step 3: "export" or listen on port
app.listen(PORT, () => {
    rowdyResults.print()
    console.log(`is that ${PORT} I hear?`)
})