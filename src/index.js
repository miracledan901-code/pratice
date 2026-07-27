const express = require("express");
const paths = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
//convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// use EJS as the view engine
app.set("view engine", "ejs");
// static files
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("login");
});


app.get("/signup", (req, res) => {
    res.render("signup");
});

//Register user
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // check if the user already exists in the database
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send("User already exists. Please choose a different username.");
        }else {
            // hash the passworld using bcrypt
           const saltRounds = 10;

            const hashedPassword = await bcrypt.hash(data.password, saltRounds);
            data.password, saltRounds// Replace the hash password with original password
           const userdata = await collection.insertMany(data);
           console.log(userdata);
        }



});

// Login user route
app.post("/login", async (req, res) => {
    try {
        // 1. Find the user by username
        const check = await collection.findOne({ name: req.body.username });
        
        if (!check) {
            return res.send("User name cannot be found");
        }

        // 2. Compare the plain text password with the hashed password in the DB
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if (isPasswordMatch) {
            // Success: Password matches
            res.render("home");
        } else {
            // Failure: Password does not match
            res.send("Wrong password");
        }

    } catch (error) {
        // Use res.send, not req.send
        res.send("wrong password");
    }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
