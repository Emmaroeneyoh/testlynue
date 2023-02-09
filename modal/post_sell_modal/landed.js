const mongoose = require("mongoose");
const schema = mongoose.Schema;



const mem_schema = new schema({
    propertyType: {
        type: String,
        required: [true, "please choose a property type"],
    },
    PropertyUse: {
        type: String,
    },
    
    
    titles: {
        type: String,
    },
    facilities: {
        type: String,
    },
    agencyfee: {
        type: Number,
    },
    regNumber: {
        type: Number,
    },
    category: {
        type:String
    },
    client:{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    houseAddress: {
        type: String,
        required: [true, "please choose an address of the apartment"],
    },
   verified: {
        type: Boolean,
       default: false,
    },
   
    display_image: {
        type: [{}],
     required: [true, "please choose a display image image"],
    }
    
    

})

const mem_mode = mongoose.model("sell_parcel", mem_schema);
module.exports = mem_mode;
