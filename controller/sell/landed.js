const land = require('../../modal/post_sell_modal/landed')
const joi = require('joi')
const ObjectId = require("mongoose").Types.ObjectId;

const cloud = require('../../config/cloud')

const createProduct = async (req, res) => {
    try {
        //getting the files and the bodys, after getting the files , we map them through to get al the specific file name
        const schema = joi.object({
          propertyType:joi.string().required(),
          PropertyUse:joi.string().required(),
          titles:joi.string().required(),
          facilities:joi.string().required(),
          category:joi.string().required(),
          
          client:joi.string().required(),
          houseAddress: joi.string().required(),
          agencyfee:joi.number(),
          
        })
        const { error } = schema.validate(req.body)
      if (error) return res.status(400).send(error.details[0].message)
      

          const {propertyType, PropertyUse, titles, facilities,category, agencyfee, client, houseAddress } = req.body
          
        if (req.files.length <= 3) {
            res.status(400).send('please add atleast 5 images')
        }
        
        //   const { images } = req.files
        const allFiles = req.files
        const pics = []
        console.log(allFiles)

        for (const file of allFiles) {
            const { path } = file;
          const result = await cloud.uploader.upload(path);
          pics.push({url:result.secure_url, id:result.public_id});
        }
          
        console.log(pics)
  
      
      //function for reg number
      const randomid = () => {
        const regNumber = Math.ceil(Math.random() * 10051006)
        return regNumber
    }
    
    const reg = randomid()
        const newproperty = await new land({
            propertyType: propertyType,
            PropertyUse: PropertyUse,
            titles: titles,
            facilities: facilities,
            category: category,
        agencyfee: agencyfee,
        client:client,
        houseAddress:houseAddress,
          display_image: pics,
          regNumber:reg
        })
         
        const saveproproperty = await newproperty.save()
          console.log(saveproproperty)
          res.json(saveproproperty)
      } catch (err) {
          console.log(err);
          
      }
}

const RentProperty = async (req, res) => {
   
  try {
      const { id } = req.params;
      console.log(id)
      console.log(ObjectId.isValid(id))
  const user = await land.findById(id);
  console.log(user)
  res.json(user);
  } catch (error) {
      console.log(error);
      res.status(400).send('error occured')
  }
};

const  RentProperties = async (req, res) => {
  try {
    const user = await land.find();
 console.log(user)
    res.json(user);
  } catch (error) {
      console.log(error);
      res.status(400).send('error occured')
  }
};


const searchRent = async (req, res) => {
  const search = req.query.property
 try {
     console.log('this is ssearc', search)
     const property = JSON.parse(search)
   const user = await land.findOne({ propertyType: property });
  console.log(user)
     res.json(user);
   } catch (error) {
     console.log(error);
     res.status(400).send('error occured')
   }
};


const updateRent = async (req, res) => {
   
  try {
      const schema = joi.object({
        propertyType:joi.string().required(),
        PropertyUse:joi.string().required(),
        titles:joi.string().required(),
        facilities:joi.string().required(),
        category:joi.string().required(),
        client:joi.string().required(),
        houseAddress: joi.string().required(),
        agencyfee:joi.number(),
        })
        const { error } = schema.validate(req.body)
        if (error) return res.status(400).send(error.details[0].message)
      const { id } = req.params
      const {
        propertyType, PropertyUse, titles, facilities,category, agencyfee, client, houseAddress 
    } = req.body;
    
      const file = req.files
     
      if(file) {
        const blog = await land.findById(id)
        // delete images first 
        const allFiles = blog.display_image
          for (const file of allFiles) {
              const result = await cloud.uploader.destroy(file.id);
              console.log(result)
        }
        const allpics = req.files
        const pics = []
        console.log(allpics)

        for (const file of allpics) {
            const { path } = file;
          const result = await cloud.uploader.upload(path);
          pics.push({url:result.secure_url, id:result.public_id});
        }
          
        console.log(pics)
          const request = await land.findByIdAndUpdate(id, {
              $set: {
                propertyType: propertyType,
                PropertyUse: PropertyUse,
                titles: titles,
                facilities: facilities,
                category: category,
            agencyfee: agencyfee,
            houseAddress:houseAddress,
              display_image: pics,
          } })
          console.log('this is the request : ' , request)
          res.json({ mssg: "property updated" })
      } else {
     
          const request = await land.findByIdAndUpdate(id, {
              $set: {
                propertyType: propertyType,
                PropertyUse: PropertyUse,
                titles: titles,
                facilities: facilities,
                category: category,
            agencyfee: agencyfee,
            houseAddress:houseAddress,
       } })
          console.log(request)
          res.json({ mssg: "property updated" })
      }
  } catch (error) {
    res.status(400).send('cant update')
  }
}


const deleteRent = async (req, res) => {
    
  try {
      const { id } = req.params;
      const blog = await land.findById(id)
      
      const allFiles = blog.display_image
        for (const file of allFiles) {
            const result = await cloud.uploader.destroy(file.id);
            console.log(result)
    }
    await land.findByIdAndDelete(id)
      res.json({id:id});
      
  } catch (error) {
      console.log(error);
      res.status(400).send('cant delete')
  }
};
module.exports = {
    createProduct , RentProperties, RentProperty, deleteRent, updateRent
}