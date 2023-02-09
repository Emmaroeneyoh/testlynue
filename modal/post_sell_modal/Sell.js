const mongoose = require("mongoose");
const schema = mongoose.Schema;



const mem_schema = new schema({
    postas: {
        type: String,
        required: [true, 'Select if you are a owner or an agent'],
      },
      propertyType: {
        type: String,
        required: [true, 'please choose a property type'],
      },
      isFurnished: {
        type: String,
        required: [true, 'please choose  if property is furnished'],
      },
      category: {
        type: String,
      },
    
      condition: {
        type: Array,
        required: [true, 'please choose a condition of your property'],
      },
      amenities: {
        type: Array,
        required: [true, 'please select the amenities the house contain'],
      },
      agencyfee: {
        type: String,
      },
      regNumber: {
        type: Number,
      },
      description: {
        type: String,
        required: [true, 'please enter the description of the home'],
      },
      price: {
        type: String,
        required: [true, 'Please enter the price of the home'],
      },
      duration: {
        type: String,
        required: [true, 'Please select the duration of the home'],
      },
      bathroom: {
        type: String,
        required: [true, 'Please enter the no of bedroom']
      },
      bedroom: {
        type: String,
        required: [true, 'Please enter the no of bedroom']
      },
      interior_size: {
        type: String
      },
    
      client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      houseAddress: {
        type: String,
        required: [true, 'please choose an address of the apartment'],
      },
      verified: {
        type: Boolean,
        default: false,
      },
      display_image: {
        type: [{}],
        required: [true, 'please choose a display image image'],
      },
      userId:{
        type:String
      }
})

const mem_mode = mongoose.model("sell", mem_schema);
module.exports = mem_mode;
