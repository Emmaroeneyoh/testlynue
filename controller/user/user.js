const User = require('../../modal/client_modal/user');
const joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;
const ejs = require('ejs');
const { signup_error, login_error } = require('../../config/userHelper');
const nodemailer = require('nodemailer');
const cloud = require('../../config/cloud');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const appPassword = process.env.appPassword;

//jwt secret for for forgot password
const user_jwt_secret = process.env.userjwtSecret;

const user_jwtSigninSecret = process.env.userjwtCookie;
//cookie name

const user_cookieName = process.env.usercookiename;

const age = 3 * 24 * 60 * 60;
const create_token = (user) => {
  return jwt.sign({ user }, 'user', {
    expiresIn: age,
  });
};
//end

const UserSignup = async (req, res) => {
  console.log(req.file);
  try {
    const schema = joi.object({
      
      email: joi.string().required().email(),
      password: joi.string().required(),
      phoneNumber: joi.number().required(),
      address: joi.string().required(),
      country: joi.string().required(),
      state: joi.string().required(),
      firstname: joi.string().required(),
      lastname: joi.string().required(),
    //  DOB: joi.string().required(),
      
      
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const {
      firstname,
      lastname,
      password,
      email,
      phoneNumber,
      country,
      state,
     // DOB,
      address
    } = req.body;
    const lowercase_email = email.toLowerCase()
    const client = await User.findOne({ email: lowercase_email });
    if (client) {
      return res.status(400).send('email already exist');
    }
    const salt = await bcrypt.genSalt();
    Harshpassword = await bcrypt.hash(password, salt);
    const form = await new User({
      firstname: firstname,
      lastname: lastname,
      phoneNumber: phoneNumber,
      password: password,
      country: country,
      state: state,
      DOB: DOB,
      email: email,
      pictureID: '',
      picture: '',
      address
    });
    const userDetails = await form.save();
    const userFirstname = userDetails.firstname;
    const userLastname = userDetails.lastname;
    const useremail = userDetails.email;
    const userphone = userDetails.phoneNumber;
    const useraddress = userDetails.address;
    const usercountry = userDetails.country;
    const userstate = userDetails.state;
    const userDOB = userDetails.DOB;
    const userID = userDetails._id;
    const userpicture = userDetails.picture;

    const user = {
      userFirstname,
      userLastname,
      useremail,
      userID,
      // userDOB,
      userphone,
      useraddress,
      userstate,
      usercountry,
      userpicture
    };
    console.log(user);
    const token = create_token(user);
    
    return res.json({token, people});
    console.log(userDetails);

    //sending welcome emails to users

    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'emmaroeneyoh@gmail.com',

        pass: appPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const data = await ejs.renderFile('./views/email/welcome.ejs', {
      firstname,
      lastname,
    });

    var mailOptions = {
      from: 'emmaroeneyoh@gmail.com',

      to: `${email}`,

      html: data,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    //end of welcome emails
  } catch (err) {
    res.status(400).send('error occured');
    console.log(err);
  }
};



const UserLogin = async (req, res) => {
  try {
    const schema = joi.object({
      email: joi.string().required().email(),
      password: joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const lowercase_email = email.toLowerCase()

    const user = await User.findOne({ email: lowercase_email });
    if (!user) {
      return res.status(400).send("email doesn't exist");
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).send('incorrect password');
    }

   

    const userDetails = await User.findOne({ email: email });
    const userFirstname = userDetails.firstname;
    const userLastname = userDetails.lastname;
    const useremail = userDetails.email;
    const userphone = userDetails.phoneNumber;
    const useraddress = userDetails.address;
    const usercountry = userDetails.country;
    const userstate = userDetails.state;
    const userpicture = userDetails.picture;
    const userDOB = userDetails.DOB;
    const userID = userDetails._id;

    const people = {
      userFirstname,
      userLastname,
      useremail,
      userphone,
      useraddress,
      userpicture,
      userDOB,
      userstate,
      usercountry,
      userID
    };
    console.log('this is logged in ', userDetails);
    const token = create_token(people);
    return res.json({people, token});
  } catch (err) {
    res.status(400).send('error occured');
    console.dir("251",err.message.Error);
  }
};

const UserForgotPassword = async (req, res) => {
  const email = req.body.email;
  console.log(req.body);

  try {
    const people = await User.findOne({ email });
    if (people) {
      console.log(people._id, people.firstname);
      const secret = user_jwt_secret + people.password;
      const payload = {
        email: people.email,
        id: people._id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: '50m' });
      const id = people._id;

      const link = `http://localhost:5000/user/reset_password/${id}/${token}`; //link to get new password from email
      //nodemailer

      const data = await ejs.renderFile('./views/admin/email.ejs', {
        link,
      });

      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'emmaroeneyoh@gmail.com',
          pass: appPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: 'emmaroeneyoh@gmail.com',

        to: `${email}`,
        subject: 'one time link',
        text: 'That was easy!',
        html: data,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          res.status(400).json({ mssg: 'email not sent' });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(400).json({ mssg: 'email not sent' });
        }
      });

      //end nodemailer
      console.log(people, link);
    }
  } catch (error) {
    res.status(400).json({ error: 'invalid request' });
  }
};

const UserNewPasword = async (req, res) => {
  const { password, id, token } = req.body;
  console.log('its super', password, id);
  try {
    const user = await User.findById({ _id: id });
    if (user) {
      console.log(user);
    }

    const secret = user_jwt_secret + user.password;
    const payload = jwt.verify(token, secret);
    user.password = password;
    console.log(user);
    const peep = await user.save();
    console.log(peep);
    res.json({ mssg: 'password changed' });
  } catch (error) {
    res.json({ error: 'password not changed' });
  }
};


const changePassword = async (req, res) => {
  const {id} = req.params
  const { password} = req.body
  
  console.log('this is request.body :', req.body)
  const salt = await bcrypt.genSalt();
  const Harshpassword = await bcrypt.hash(password, salt);
  console.log('this is harsh ; ' , Harshpassword)
  try {
      const allCatgeory = await User.findByIdAndUpdate(id, {
          $set: {
              password:Harshpassword
          }
      })
      res.json({ mssg: "password updated" })
    console.log(allCatgeory)
    const newp = await User.findById(id)
    console.log(newp)
  } catch (error) {
    console.log(error)
    res.status(400).send('error occured while chaning password')
  }
}

const UserLogout = (req, res) => {
  res.cookie(user_cookieName, '', { maxAge: 1 });
  console.log('admin loged out');
  res.status(200).json({ mssg: 'user loged out' });
};

module.exports = {
  UserSignup,
  UserLogin,
  UserForgotPassword,
  UserNewPasword,
  UserLogout,
  changePassword
};
