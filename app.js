const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const dotenv = require('dotenv')
dotenv.config({path: "./config/config.env"})
const cors = require('cors')
const path = require("path");
//route for getting all the admin signup/login
const admin = require('./route/admin_route/admin')
const adminCrud = require('./route/admin_route/crud')

//route for renting properties
const Rent = require('./route/rent_route/Rent')
const rentParcel = require('./route/rent_route/land')
//router for selling property
const Sell = require('./route/sell_route/Sell')
const sellParcel = require('./route/sell_route/land')

//route for getting all the admin signup/login
const client = require('./route/client_route/user')
const ticket = require('./route/client_route/ticket')
const preview = require('./route/client_route/preview')



//getting all local user for admin



const app = express();
//load config file



//conecting mongoose to mongodb server
const base = process.env.mongoPaasword;

mongoose
  .connect(base)
  .then((result) => console.log("rose-base has connected"))
  .catch((err) => console.log(err, "error has ocured in rose-base"));
//end

app.set("view engine", "ejs");

//applying our middleware
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));






//applying middleware for all our admins
app.use(admin);
app.use(adminCrud);


//applying middleware for all our user
app.use(client);
app.use(ticket)
app.use(preview);

// for renting property property 
app.use(Rent)
app.use(rentParcel)

//for selling property
app.use(Sell)
app.use(sellParcel)

// app.listen(9000, () => console.log("coonected"));
const port = process.env.port

if (require.app === module) {
  app.listen(port, () => {
    console.log("conneted to port ", port);
  });
}


//error handler
app.use((req, res, next) => {
  const error = new Error('API not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
      error: {
          message : error.message
      }
  })
  console.log(error)
})


app.listen(port, () => {
  console.log("conneted to port ", port);
});

module.exports = app;
