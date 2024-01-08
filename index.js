const express = require("express");
require("dotenv").config();
const {sequelize} = require("./database-config");
//sequelize.sync({ force: true });
const User = require("./usermodel");
const { userRouter } = require("./router");
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const Joi = require('joi')


app.use((req, res , next)=>{
            next();
})

app.use(bodyParser.json());
app.use(express.json());
app.use("/users", userRouter) 

const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('hex');

// Middleware for token validation
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
};


const constUserValidator = Joi.object({
  email:Joi.string().required(),
  password:Joi.string().required(),
})
const userValidator =(req,res,next)=> {
   const {error} = constUserValidator.validate(req.body);
   if(error)
   {
    res.send({
      code:400,
      message:"Bad Requst."
    })
   }  
   return next() 
}

// Login API
app.post("/login", userValidator, async (req, res) => {
    const { email, password } = req.body;
  
    // Authenticate user
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  
    // Generate access token
    const accessToken = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "5h", 
    });
  
    res.json({ accessToken });
  });
  
  // Register API
  app.post("/register", async (req, res) => {
    const { name, username, phone_number, email, password } = req.body;
  
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    try {
      const newUser = await User.create({
        name,
        username,
        phone_number,
        email,
        password: hashedPassword,
      });
  
      res.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // Main Screen API (Private)
  app.get("/main", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the main screen!" });
  });

  

app.listen(3000 , ()=>{
    console.log(" Started the application.")
})

