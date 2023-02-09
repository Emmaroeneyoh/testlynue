const router = require('express').Router()
const {admin_check , user_check} = require('../../config/authCheck')
const { createProduct , RentProperties, RentProperty, deleteRent, updateRent } = require('../../controller/rent/landed')
const { propertyPic} = require('../../config/rent')



  

router.post("/rent/parcel", user_check, propertyPic.array('display_image', 10), createProduct );
router.delete("/rent/parcel/:id", user_check, deleteRent);
router.put("/rent/parcel/:id", user_check, propertyPic.array('display_image', 10), updateRent);
router.get("/rent/parcel/:id", user_check, RentProperty);
router.get("/rent/parcel", user_check, RentProperties);

  

module.exports = router