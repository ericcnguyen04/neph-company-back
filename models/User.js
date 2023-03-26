// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  items: [{
    // tell mongoose that this is a reference
    type: mongoose.Schema.Types.ObjectId,
    // tell mongoose what is being reference
    ref: 'Post'
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)