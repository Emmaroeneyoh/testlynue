const router = require("express").Router();
const {user_check} = require('../../config/authCheck')
const { UserSignup, UserLogin, UserForgotPassword, UserNewPasword, UserLogout , changePassword } = require('../../controller/user/user')
const {  updateUserDetail, user , updateUserImage } = require('../../controller/user/crud')
const {UserProfilePic} = require('../../config/userHelper')


router.post("/user/signup", UserSignup );
router.post("/user/login",UserLogin );

//for forgot password feature
router.post("/user/forgot_password", UserForgotPassword);
router.post("/user/new_password", UserNewPasword);
router.put("/user/changepassword/:id", changePassword);
router.post("/user/logout", UserLogout);


// for CRUD functionality 
router.put("/user/photo/:id", user_check,  UserProfilePic.single('userPicture'), updateUserImage);
router.put("/user/detail/:id", user_check ,  updateUserDetail);
router.get("/user/:id",  user_check ,user);

module.exports = router