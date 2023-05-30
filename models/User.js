const {Schema, model} = require("../db/db") // import Schema & model

// User Schema
const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true},
    password: {type: String, required: true}
})

// User model
const User = model("User", UserSchema)

module.exports = User