const mongoose = require("mongoose");
const schema = mongoose.Schema;
const { isEmail } = require("validator");
// const bycrpt = require("bcrypt");

const mem_schema = new schema({
  

  email: {
    type: String,
    required: [true, "please enter an  email address"],
    validate: [isEmail, "please enter a valid mail address"],
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const mem_mode = mongoose.model("waitlist", mem_schema);
module.exports = mem_mode;
