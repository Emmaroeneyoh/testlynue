const admin = require('../../modal/admin_modal/admin')
const joi = require('joi')
const ObjectId = require("mongoose").Types.ObjectId;
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const cloud = require('../../config/cloud')


const appPassword = process.env.appPassword


//jwt secret for for forgot password
const jwt_secret = process.env.jwtSecret;

const jwtSigninSecret = process.env.jwtCookie 
//cookie name

const cookieName = process.env.cookiename

const age = 3 * 24 * 60 * 60;
const create_token = (user) => {
  return jwt.sign({ user}, 'admin', {
    expiresIn: age,
  });
};
//end

const AdminSignup =  async (req, res) => {
  console.log(req.file);
  try {
    const schema = joi.object({
      firstname: joi.string().required(),
      lastname: joi.string().required(),
      email: joi.string().required().email(),
      password: joi.string().required(),
      address: joi.string().required(),
      DOB: joi.string().required(),
      role: joi.string().required(),
      phoneNumber: joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      firstname,
      lastname,
      password,
      email,
      phoneNumber,
      DOB,
      address,
      role
    } = req.body;
    const client = await admin.findOne({ email: email });
    if (client) {
      return res.status(400).send('email already exist');
    }
    const salt = await bcrypt.genSalt();
    Harshpassword = await bcrypt.hash(password, salt);
    const filer = req.file;
    console.log(filer);
    const result = await cloud.uploader.upload(req.file.path);
    console.log(result);
    if (filer) {
      const form = await new admin({
        firstname: firstname,
        lastname: lastname,
        phoneNumber: phoneNumber,
        password: password,
        role,
        DOB: DOB,
        email: email,
        address:address,

        pictureID: result.public_id,
        picture: result.secure_url,
      });
      const userDetails = await form.save();

      const userFirstname = userDetails.firstname;
      const userLastname = userDetails.lastname;
      const useremail = userDetails.email;
      const userphone = userDetails.phoneNumber;
      const useraddress = userDetails.address;
      const userrole = userDetails.role
      const userDOB = userDetails.DOB;
      const userID = userDetails._id;
      const userpicture = userDetails.picture;

      const user = {
        userFirstname,
        userLastname,
        useremail,
        userID,
        userDOB,
        userphone,
        useraddress,
        userpicture,
        userrole
     
      };
      console.log(user);
      const token = create_token(user);
      
      res.json({token, user});
      console.log(userDetails);
    } else {
      const form = await new admin({
        firstname: firstname,
        lastname: lastname,
        phoneNumber: phoneNumber,
        password: password,
       address:address,
        DOB: DOB,
        email: email,
        role
      });
      const userDetails = await form.save();
      const userFirstname = userDetails.firstname;
      const userLastname = userDetails.lastname;
      const useremail = userDetails.email;
      const userphone = userDetails.phoneNumber;
      const useraddress = userDetails.address;
      const userpicture = userDetails.picture;
      const userDOB = userDetails.DOB;
      const userID = userDetails._id;
      const userrole = userDetails.role;

      const user = {
        userFirstname,
        userLastname,
        useremail,
        userID,
        userDOB,
        userphone,
        useraddress,
        userpicture,
        userrole
      };
      console.log(user);
      const token = create_token(user);
     
      res.json({mssg:"new admin created"});
      console.log(userDetails);
    }

        //sending welcome emails to users
  
        var transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "emmaroeneyoh@gmail.com",
  
            pass: appPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
  
        const data = await ejs.renderFile("./views/email/welcome.ejs", {
          firstname,
          lastname,
        });
  
        var mailOptions = {
          from: "emmaroeneyoh@gmail.com",
  
          to: `${email}`,
         
          html: data,
        };
  
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
  
        //end of welcome emails
        
      
    } catch (err) {
    res.status(400).send('error occured')
    console.log(err)
    }
}

const AdminLogin = async (req, res) => {
   
  
  try {
    const schema = joi.object({
     
      email:joi.string().required().email(),
      password:joi.string().required(),
     
    })
    const { error } = schema.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const { email, password } = req.body;

    const user = await admin.findOne({ email: email });
    console.log('this is user : ', user)
    if (!user) {
      return  res.status(400).send('email doesnt exist')
    }
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      return  res.status(400).send('incorrect password')
    }
    
      
      // res.cookie(cookieName, token, { httpOnly: true, maxAge: age * 1000,  });
  
      
  
      const userDetails = await admin.findOne({email:email})
      const userFirstname = userDetails.firstname
      const userLastname = userDetails.lastname
      const useremail = userDetails.email
      const userphone = userDetails.phoneNumber
      const useraddress = userDetails.address
      const userpicture = userDetails.picture
      const userrole = userDetails.role
      const userID = userDetails._id
  
    const people = { userFirstname, userLastname, useremail, userID, userphone, useraddress, userpicture, userrole }
    const token = create_token(people);
      console.log('this is loged in ', people)
      res.json({people, token})
  
  } catch (err) {
    console.log(err)
      res.status(400).send('error occured')
    }
  }

  const AdminForgotPassword  = async (req, res) => {
    const email = req.body.email;
    console.log(email);
  
    try {
      const people = await admin.findOne({ email });
      if (people) {
        console.log(people._id, people.firstname);
        const secret = jwt_secret + people.password;
        const payload = {
          email: people.email,
          id: people._id,
        };
        const token = jwt.sign(payload, secret, { expiresIn: "50m" });
        const id = people._id;
  
        const link = `http://localhost:5000/admin/reset_password/${id}/${token}`; //link to get new password from email
        //nodemailer
        
  
        const data = await ejs.renderFile("./views/admin/email.ejs", {
          link,
        });
  
        
        var transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "emmaroeneyoh@gmail.com",
            pass: appPassword,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
  
        var mailOptions = {
          from: "emmaroeneyoh@gmail.com",
  
          to: `${email}`,
          subject: "one time link",
          text: "That was easy!",
          html: data,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              console.log(error);
              return  res.status(400).send('error occurred.. password link not sent')
          } else {
            console.log("Email sent: " + info.response);
            return res.status(200).json({mssg:'email sent'})
          }
        });
  
        //end nodemailer
        console.log(people, link);
      }
    } catch (error) {
      res.status(400).send('error occured');
    
    }
}
  
const AdminNewPasword = async (req, res) => {
    const { password,  id, token  } = req.body;
    console.log('its super', password, id);
    try {
      const user = await admin.findById({ _id: id });
      if (user) {
        console.log(user);
      }
  
      const secret = jwt_secret + user.password;
      const payload = jwt.verify(token, secret);
      user.password = password;
      console.log(user);
      const peep = await user.save();
      console.log(peep);
      res.json({mssg:'password changed'})
    } catch (error) {
        res.status(400).send('password not changed')
      
    }
}

const changePassword =  async (req, res) => {
  const { password , id } = req.body
  
  console.log('this is request.body :', req.body)
  const salt = await bcrypt.genSalt();
  const Harshpassword = await bcrypt.hash(password, salt);
  console.log('this is harsh ; ' , Harshpassword)
  try {
      const allCatgeory = await admin.findByIdAndUpdate(id, {
          $set: {
              password:Harshpassword
          }
      })
      res.json({ mssg: "password updated" })
      console.log(allCatgeory)
  } catch (error) {
    console.log(error)
    res.status(400).send('error occured while chaning password')
  }
}

const AdminLogout = (req, res) => {
    res.cookie(cookieName, '', { maxAge: 1 })
    console.log('admin loged out')
    res.status(200).json({mssg: 'user loged out'})
  }

module.exports = {
    AdminSignup ,  AdminLogin , AdminForgotPassword , AdminNewPasword, AdminLogout , changePassword
}