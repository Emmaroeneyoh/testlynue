const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bycrpt = require("bcrypt");

const mem_schema = new schema({
 
  complain: {
    type: String,
    },
    
  status: {
      type: String,
      default:'pending'
  },
    
 chat: [
        {
        id: {
          type:  mongoose.Schema.Types.ObjectId,
          ref:'chat'
            }
           
          }
  ],

user : { 
        type:  mongoose.Schema.Types.ObjectId,
        ref:'user'
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const mem_mode = mongoose.model("ticket", mem_schema);
module.exports = mem_mode;
