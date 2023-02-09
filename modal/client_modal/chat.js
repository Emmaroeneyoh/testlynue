const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bycrpt = require("bcrypt");

const mem_schema = new schema({
 
  chat: {
    type: String,
    },
    

user : { 
        type:  mongoose.Schema.Types.ObjectId,
        ref:'user'
},
ticket : { 
        type:  mongoose.Schema.Types.ObjectId,
        ref:'ticket'
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const mem_mode = mongoose.model("chat", mem_schema);
module.exports = mem_mode;
