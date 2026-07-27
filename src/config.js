const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/login-page");

//check database connect or not
connect.then(() => {
    console.log("Database connected successfully");
})
.catch((err) => {
    console.log("Database cannott be connected");
});

// Create a schema for user
const LoginSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;