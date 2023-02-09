const router = require('express').Router()
const User = require("../../modal/client_modal/waitlist");

//waitlist
router.get("/user/waitlist", async (req, res) => {
  try {
      const people = await User.find()
      res.json({msg: "user coming through", people})
    
    } catch (error) {
      res.json({msg:'No email found, try again'})
    }
  });


  router.post("/user/waitlist", async (req, res) => {

    const {email} = req.body
   
   
   
   
       try {
   
          const checkEmail = await User.findOne({email:email})
   
          if(checkEmail) {
   
           res.json({msg:'email already exist', userEmail:checkEmail.email})
   
          } else {
   
           const newWaitlist = await new User(req.body)
   
           const savedWailtlist = await newWaitlist.save()
   
           
   
         res.json({msg:'email added to waitlist', userEmail:email})
   
          }
   
       
   
       } catch (error) {
   
         res.json({msg:'No email address inputed, try again'})
   
       }
   
     });


module.exports = router