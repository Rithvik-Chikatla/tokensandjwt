const express = require("express")
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'randomdandan'
const app = express()

app.use(express.json()) // to read and parse the body from the post reqs

const users = []

// function generateToken() {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let token = '';
//     for (let i = 0; i < 16; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         token += characters[randomIndex];
//     }
//     return token;
// }

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(users.find(u => u.username === username)) {
        res.json({
            message: "User already exists"
        })
        return
    }

    if(password.length < 5) {
        res.json({
            message: "Password is too small"
        })
        return
    }

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed in"
    })

    console.log(users)
})

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let foundUser = users.find(function(u) {
        if(u.username === username && u.password === password) return true;
        return false;
    })
    if(foundUser) {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET)

        // foundUser.token = token;
        res.json({
            token: token
        })
    }
    else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
})

app.get("/me", (req, res) => {
    const token = req.headers.token

    const decodedInformation = jwt.verify(token, JWT_SECRET); // gets the {username: dan} obj
    const username = decodedInformation.username;

    let foundUser = null;

    for(let i = 0; i < users.length; i++) {
        if(users[i].username === username) {
            foundUser = users[i];
        }
    }
    if(foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }
    else {
        res.json({
            message: "Invalid token"
        })
    }
})

app.listen(3000)