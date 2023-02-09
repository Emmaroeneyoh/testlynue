const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { isEmail } = require("validator");
const bycrpt = require("bcrypt");

const mem_schema = new schema({
  firstname: {
    type: String,
    required: [true, "please choose firstname"],
  },
  lastname: {
    type: String,
    required: [true, "please choose a lastname"],
  },
  picture: {
    type: String,
  },
  pictureID: {
    type: String,
  },

  address: {
    type: String,
  },

  phoneNumber: {
    type: Number,
  },
  role: {
    type: String,
    required: [true, "please choose a role"],
  },
  DOB: {
    type: String,
    required: [true, "please choose a role"],
  },

  email: {
    type: String,
    required: [true, "please enter an  email address"],
    validate: [isEmail, "please enter a valid mail address"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please input a password"],
    minlength: [5, "password cant be less than 5 digits"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
mem_schema.pre("save", async function (next) {
  const salt = await bycrpt.genSalt();
  this.password = await bycrpt.hash(this.password, salt);
  next();
});
mem_schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const pass = await bycrpt.compare(password, user.password);
    if (pass) {
      return user;
    }
    throw Error("incorect password");
  }
  throw Error("incorrect email");
};

const mem_mode = mongoose.model("admin", mem_schema);
module.exports = mem_mode;
