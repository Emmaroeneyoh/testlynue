const router = require('express').Router()
const {admin_check , user_check} = require('../../config/authCheck')
const { createProduct , RentProperties, RentProperty, deleteRent, updateRent } = require('../../controller/sell/crud')
const { propertyPic} = require('../../config/rent')



  

router.post("/sell/property", user_check, propertyPic.array('display_image', 10), createProduct );
router.delete("/sell/property/:id", user_check, deleteRent);
router.put("/sell/property/:id", user_check, propertyPic.array('display_image', 10), updateRent);
router.get("/sell/property/:id", user_check, RentProperty);
router.get("/sell/property", RentProperties);

  

module.exports = router