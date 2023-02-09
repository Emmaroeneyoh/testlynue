const multer = require('multer')
const path = require('path')

//multer define/ setting up
console.log(__dirname)
const storage = multer.diskStorage({
    filename : (req, file, cb) => {
         cb(null, Date.now() + file.originalname)
    }
})
const  UserProfilePic = multer({
    storage:storage,
    limits: 1034*1034 *5
})


//function to handle error
const signup_error = (err) => {
    console.log(err.message, err.code);
    let errors = {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      address:"",
        phoneNumber: '',
        DOB: '',
        country: '',
        state: '',
        picture:''
    };
  
    if (err.code === 11000) {
      errors.email = "email exist already";
    }
   
  
    if (err.message.includes("user validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    if (err.message.includes("check validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  };
  
const login_error = (err) => {
    console.log(err.message, err.code);
    let errors = {
      email: "",
      password: "",
    };
  
   
    if (err.message === "incorrect email") {
        errors.email = "email not registered";
      }
    
      if (err.message === "incorect password") {
        errors.password = "incorrect password";
      }
  
    if (err.message.includes("user validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    if (err.message.includes("check validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  };
  

  
module.exports = {
    signup_error, login_error, UserProfilePic
}