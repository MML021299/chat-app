const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const auth = require("./auth");

// require database connection 
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const Message = require("./db/messageModel");

// execute database connection 
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});

app.post("/register", (request, response) => {
  bcrypt.hash(request.body.password, 10)
  .then(async (hashedPassword) => {
    // create unique ID for new users
    const uniqueId = crypto.randomBytes(3*4).toString('base64')
    // create a new user instance and collect the data
    const user = new User({
      email: request.body.email,
      username: request.body.username,
      password: hashedPassword,
      uniqueId
    });

    const usernameExists = await User.find({ username: request.body.username });
    if(usernameExists.length > 0){
      response.status(500).send({
        message: "Username already taken",
      });
    } else {
      // save the new user
      user.save().then((result) => {
        response.status(201).send({
          message: "User Created Successfully",
          result,
        });
      })
      .catch((error) => {
        console.log(error)
        var message = "";
        if (error.name === "ValidationError") {
          message = Object.values(error.errors).map(e => e.message);
        } else if (error.code === 11000) {
          message = "Email already registered";
        } else {
          message = "Registration Failed (Unknown Error)";
        }
        response.status(500).send({
          message,
          error,
        });
      });
    }
  })
  .catch((e) => {
    response.status(500).send({
      message: "Password was not hashed successfully",
      e,
    });
  })
});

app.post("/login", (request, response) => {
  User.findOne({ username: request.body.username })
    .then((user) => {
      bcrypt.compare(request.body.password, user.password)
      .then((passwordCheck) => {
        // check if password matches
        if(!passwordCheck) {
          return response.status(400).send({
            message: "Incorrect password",
            error,
          });
        }

        //   create JWT token
        const token = jwt.sign(
          {
            userId: user._id,
            userName: user.username,
          },
          "RANDOM-TOKEN",
          { expiresIn: "24h" }
        );

        //   return success response
        response.status(200).send({
          message: "Login Successful",
          username: user.username,
          token,
        });
      })
      .catch((error) => {
        response.status(400).send({
          message: "Incorrect password",
          error,
        });
      })
    })
    .catch((e) => {
      response.status(404).send({
        message: "Username not found",
        e,
      });
    });
})

// get list of users
app.get("/users", (request, response) => {
  try {
    User.find({}).then((users) => {
      response.json({ message: users })
    })
  } catch (error) {
    response.json({ message: error })
  }
})

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
    console.log(request)
  // response.json({ message: "You are authorized to access me" });
  response.json({ user: request.user });
});

// fetch chat history
app.get("/chat-history", (request, response) => {
  try {
    Message.find({room: request.query.room}).then((msg) => {
      response.json({ messages: msg })
    })
  } catch (error) {
    response.json({ message: error })
  }
});

module.exports = app;
