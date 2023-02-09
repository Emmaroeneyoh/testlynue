const router = require('express').Router()
const { admin, admins, searchAdmin, deleteAdmin, updateAdmin} = require('../../controller/admin/crud')
const { admin_check } = require('../../config/authCheck')
const {   AdminProfilePic, } = require('../../config/helper')


//crud operation on admin
router.get("/admin/:id",  admin_check([ 'superadmin']), admin);
router.get("/admin", admin_check([ 'superadmin']),  admins);
router.get("/admin/search",  admin_check([ 'superadmin']), searchAdmin);
router.put("/admin/:id", admin_check([ 'superadmin']), AdminProfilePic.single('adminPicture'),  updateAdmin);
router.delete("/admin/:id",  admin_check([ 'superadmin']), deleteAdmin);

//signup 
// router.get("/admin/search",   searchAdmin);
// router.get("/admin/:id",   admin);
// router.get("/admin",   admins);

// router.put("/admin/:id", AdminProfilePic.single('adminPicture'),  updateAdmin);
// router.delete("/admin/:id",   deleteAdmin);


module.exports = router