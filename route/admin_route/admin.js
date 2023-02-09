const router = require('express').Router()
const {  signup_error, login_error, AdminProfilePic, } = require('../../config/helper')
const { AdminSignup , AdminLogin, AdminForgotPassword , AdminNewPasword, AdminLogout , changePassword} = require('../../controller/admin/admin')
const {admin_check} = require('../../config/authCheck');
const { request } = require('../../app');


//signup 
router.post("/admin/signup",    AdminProfilePic.single('adminPicture'), AdminSignup);
// router.post("/admin/signup",   AdminProfilePic.single('adminPicture'), AdminSignup);
router.post("/admin/login", AdminLogin);

//for forgot password feature
router.post("/admin/forgot_password", AdminForgotPassword);
router.post("/admin/new_password", AdminNewPasword);
router.put("/admin/changePassword", admin_check([ 'superadmin']), changePassword);
router.get('/admin/logout', AdminLogout)

// //signup 
// router.post("/admin/signup",  admin_check([ 'superadmin']), AdminProfilePic.single('adminPicture'), AdminSignup);
// // router.post("/admin/signup",   AdminProfilePic.single('adminPicture'), AdminSignup);
// router.post("/admin/login", AdminLogin);

// //for forgot password feature
// router.post("/admin/forgot_password", AdminForgotPassword);
// router.post("/admin/new_password", AdminNewPasword);
// router.get('/admin/logout', AdminLogout)

// router.get("/check",auth_check(['admin', 'seller']), (req, res) => {
//   res.json({mssg: 'you are free for the requet'})
// });




module.exports = router
