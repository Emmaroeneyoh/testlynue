const User = require('../../modal/client_modal/user')

const ObjectId = require('mongoose').Types.ObjectId

const cloud = require('../../config/cloud')


const updateUserImage = async (req, res) => {
   
    console.log(req.file)
    try {
     const { id } = req.params
        const filer = req.file
        console.log('this is file' , filer)
     const admin = await User.findById(id)
 
     if (admin.pictureID) {
         const deleteUserimg = await cloud.uploader.destroy(admin.pictureID)
         if (deleteUserimg) {
             const result = await cloud.uploader.upload(req.file.path)
         console.log(result)
         const request = await User.findByIdAndUpdate(id, {
             $set: {
             pictureID:result.public_id,
             picture: result.secure_url, 
         } })
         console.log('this is the request : ' , request)
         res.json({ mssg: request })
        }
     } else {
         const result = await cloud.uploader.upload(req.file.path)
         const request = await User.findByIdAndUpdate(id, {
             $set: {
             pictureID:result.public_id,
             picture: result.secure_url,
         } })
         res.json({ mssg: request}) 
 }
    } catch (error) {
        console.log(error)
        res.status(400).send('Can\'t update image')
    }
 }
 
 
const  updateUserDetail = async (req, res) => {
   console.log("this is the second api testing")
    try {

        const { id } = req.params
        const {
            firstname, lastname, password, email,phoneNumber, country, state, DOB 
          } = req.body;
        console.log('tis is req.body ; ' ,req.body)
        const request = await User.findByIdAndUpdate(id, {
            $set: {
                firstname: firstname,
                lastname: lastname,
                // phoneNumber: phoneNumber,
                // password: password,
                // country: country,
                // state: state,
                // DOB: DOB,
                email: email,
     }  },  { new:true})

        res.json({ User: request }) 
    } catch (error) {
        console.log(error)
        res.status(400).send('cant update user details')
    }
}

const user = async (req, res) => {
   
    try {
        const { id } = req.params;
        console.log(id)
        console.log(ObjectId.isValid(id))
    const user = await User.findById(id);
    console.log("81",user)
    res.json(user);
    } catch (error) {
        console.log(error);
        res.status(400).send('user not found')
    }
};

module.exports = {
    updateUserDetail, user , updateUserImage 
}