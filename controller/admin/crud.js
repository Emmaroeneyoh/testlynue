const Admin = require('../../modal/admin_modal/admin')
const joi = require('joi')
const ObjectId = require('mongoose').Types.ObjectId
const cloud = require('../../config/cloud')

const admin = async (req, res) => {
   
    try {
        const { id } = req.params;
        console.log(id)
        console.log(ObjectId.isValid(id))
    const user = await Admin.findById(id);
    console.log(user)
    res.json(user);
    } catch (error) {
        console.log(error);
        res.status(400).send('error occured')
    }
};


const  admins = async (req, res) => {
    try {
      const user = await Admin.find();
   console.log(user)
      res.json(user);
    } catch (error) {
        console.log(error);
        res.status(400).send('error occured')
    }
};

const searchAdmin = async (req, res) => {
    const search = req.query.admin
   try {
       console.log('this is ssearc', search)
       const adminEmail = JSON.parse(search)
     const user = await Admin.findOne({ email: adminEmail });
    console.log(user)
       res.json(user);
     } catch (error) {
       console.log(error);
       res.status(400).send('error occured')
     }
 };

 
const updateAdmin = async (req, res) => {
   
    try {
        const schema = joi.object({
            firstname:joi.string(),
            lastname:joi.string(),
            email:joi.string().email(),
            DOB:joi.string(),
            password:joi.string(),
            role:joi.string(),
            address:joi.string(),
            phoneNumber:joi.number()
          })
          const { error } = schema.validate(req.body)
          if (error) return res.status(400).send(error.details[0].message)
        const { id } = req.params
        const {
            firstname,
            lastname,
            password,
            email,
            dob,
            phoneNumber,
            address,
            role
          } = req.body;
        const filer =  req.file
        console.log(filer,req.body)
        if(filer) {
            const admin = await Admin.findById(id)
            const deleteAdminimg = await cloud.uploader.destroy(admin.pictureID)
            if (deleteAdminimg) {
                const result = await cloud.uploader.upload(req.file.path)
                console.log(result)
                const request = await Admin.findByIdAndUpdate(id, {
                    $set: {
                        firstname: firstname,
                        lastname: lastname,
                        phoneNumber: phoneNumber,
                        password: password,
                        address:address,
                        email: email,
                        DOB:DOB,
                        pictureID:result.public_id,
                          picture: result.secure_url,
                        role:role
                } })
                console.log('this is the request : ' , request)
                res.json({ mssg: "Admin updated" })
            }
           
        } else {
       
            const request = await Admin.findByIdAndUpdate(id, {
                $set: {
                    firstname: firstname,
                    lastname: lastname,
                    phoneNumber: phoneNumber,
                    password: password,
                    address:address,
                    email: email,
                    dob: dob,
                    role:role
         } })
            console.log(request)
            res.json({ Admin: "Admin updated" })
        }
    } catch (error) {
      res.status(400).send('cant update')
    }
}

const deleteAdmin = async (req, res) => {
    
    try {
        const { id } = req.params;
        const admin = await Admin.findById(id)
        const deleteAdminimg = await cloud.uploader.destroy(admin.pictureID)
        if (deleteAdminimg) await Admin.findByIdAndDelete(id)
        
        res.json({id:id});
        
    } catch (error) {
        console.log(error);
        res.status(400).send('cant delete')
    }
};
module.exports = {
    admin, admins, searchAdmin, deleteAdmin, updateAdmin
}