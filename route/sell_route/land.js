const router = require('express').Router()
const {admin_check , user_check} = require('../../config/authCheck')
const { createProduct , RentProperties, RentProperty, deleteRent, updateRent } = require('../../controller/sell/landed')
const { propertyPic} = require('../../config/rent')



  

router.post("/sell/parcel", user_check, propertyPic.array('display_image', 10), createProduct );
router.delete("/sell/parcel/:id",  user_check, deleteRent);
router.put("/sell/parcel/:id",  user_check, propertyPic.array('display_image', 10), updateRent);
router.get("/sell/parcel/:id",  user_check, RentProperty);
router.get("/sell/parcel",  user_check, RentProperties);

  

module.exports = router