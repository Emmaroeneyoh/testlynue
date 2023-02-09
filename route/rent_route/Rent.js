const router = require('express').Router()
const {admin_check , user_check} = require('../../config/authCheck')
const { createProduct , RentProperties, RentProperty, deleteRent, updateRent} = require('../../controller/rent/crud')
const { propertyPic} = require('../../config/rent')



  

router.post("/rent/property", user_check , propertyPic.array('display_image', 10), createProduct );
router.delete("/rent/property/:id",  user_check ,deleteRent);
router.put("/rent/property/:id", user_check , propertyPic.array('display_image', 10), updateRent);
router.get("/rent/property/:id", user_check , RentProperty);
router.get("/rent/property",  RentProperties);
  

module.exports = router