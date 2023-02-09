
const multer = require('multer')
const path = require('path')



//multer define/ setting up
const storage = multer.diskStorage({
    filename : (req, file, cb) => {
         cb(null, Date.now() + file.originalname)
    }
})
const propertyPic = multer({
    storage:storage,
    limits: 1034*1034 *5
})

const multi = propertyPic.fields( { name: "blogImage" });
//end



//fucntion to handle error
const Rent_error = (err) => {
    console.log(err.message, err.code);
    let errors = {
        propertyType: "",
        isFurnushed: "",
      condition: "",
      houseAddress: "",
        display_image:""
    };
  
    if (err.code === 11000) {
      errors.email = "email exist already";
    }
   
  
    if (err.message.includes("rent validation failed")) {
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
    Rent_error, propertyPic
  }