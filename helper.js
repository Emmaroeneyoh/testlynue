const multer = require('multer')
const path = require('path')



//multer define/ setting up
const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
       cb(null, path.join(__dirname, './public/upload'))
    },
    filename : (req, file, cb) => {
         cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({
    storage:storage,
    limits: 1034*1034 *5
})

const multi = upload.fields([
  { name: "cover_photo" },
  { name: "display_photo", maxCount: 4 },
]);
//end


//error handler for house posting 

const handle_error = (err) => {
    console.log(err.message, err.code);
    let errors = {
        propertyType: "",
        isFurnushed: "",
      condition: "",
      cover_image: "",
        display_image:""
    
    };
  
  
    if (err.message.includes("RENT/residential validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    
    return errors;
  };
  

module.exports = {
    multi, handle_error
}