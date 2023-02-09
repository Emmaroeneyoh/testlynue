const Rent = require('../../modal/post_sell_modal/Sell');
const joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;

const cloud = require('../../config/cloud');

const createProduct = async (req, res) => {
  const {
    postas,
    propertyType,
    isFurnished,
    condition,
    amenities,
    houseAddress,
    category,
    bathroom,
    bedroom,
    interior_size,
    agencyfee,
    description,
    duration,
    price, 
    userId
  } = req.body;

  let parsedCondition = JSON.parse(condition);
  let parsedAmenities = JSON.parse(amenities);

  let formatData = {
    postas,
    propertyType,
    isFurnished,
    condition: parsedCondition,
    amenities: parsedAmenities,
    houseAddress,
    category,
    agencyfee,
    description,
    duration,
    price,
    bathroom,
    bedroom,
    interior_size,
    userId
  }
  
  try {
    //getting the files and the bodys, after getting the files , we map them through to get all the specific file name
    const schema = joi.object({
      postas:joi.string().required(),
      propertyType: joi.string().required(),
      isFurnished: joi.string().required(),
      condition: joi.array().required(),
      amenities: joi.array().required(),
      category: joi.string().required(),
      description: joi.string().required(),
      price: joi.string().required(),
      duration:joi.string().required(),
      bathroom: joi.string().required(),
      bedroom: joi.string().required(),
      interior_size: joi.string(),
      houseAddress: joi.string().required(),
      agencyfee: joi.string(),
      userId: joi.string()
    });

    const { error } = schema.validate(formatData);
    if (error) return res.status(400).send(error.details[0].message);

    
    console.log(formatData);

    if(req.files){console.dir(req.file)}
    if (req.files.length <= 3) {
      res.status(400).send('please add atleast 5 images');
    } 

    //   const { images } = req.files
    const allFiles = req.files;
    const pics = [];
    console.log(allFiles);

    for (const file of allFiles) {
      const { path } = file;
      const result = await cloud.uploader.upload(path);
      pics.push({ url: result.secure_url, id: result.public_id });
    }

    console.log(pics);

    //function for reg number
    const randomid = () => {
      const regNumber = Math.ceil(Math.random() * 10051006);
      return regNumber;
    };

    const reg = randomid();
    const newproperty = await new Rent({
      postas:postas,
      propertyType: propertyType,
      isFurnished: isFurnished,
      condition: parsedCondition,
      agencyfee: agencyfee,
      amenities: parsedAmenities,
      category: category,
      houseAddress: houseAddress,
      display_image: pics,
      regNumber: reg,
      description,
      duration,
      price,
      bedroom,
      bathroom,
      interior_size,
      userId
    });

    const saveproproperty = await newproperty.save();
    console.log(saveproproperty);
    res.json(saveproproperty);
  } catch (err) {
    console.log(err);
  }
};

const RentProperty = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    console.log(ObjectId.isValid(id));
    const user = await Rent.findById(id);

    if (!user) res.status(400).send('property not found');
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send('error occured');
  }
};

const RentProperties = async (req, res) => {
  try {
    const user = await Rent.find();
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send('error occured');
  }
};

const searchRent = async (req, res) => {
  const search = req.query.property;
  try {
    console.log('this is ssearc', search);
    const property = JSON.parse(search);
    const user = await Rent.findOne({ propertyType: property });
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send('error occured');
  }
};

const updateRent = async (req, res) => {
  try {
    const schema = joi.object({
      propertyType: joi.string().required(),
      isFurnushed: joi.string().required(),
      condition: joi.string().required(),
      category: joi.string().required(),
      client: joi.string().required(),
      houseAddress: joi.string().required(),
      agencyfee: joi.number(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { id } = req.params;
    const {
      propertyType,
      isFurnushed,
      condition,
      agencyfee,
      client,
      houseAddress,
      category,
    } = req.body;

    const file = req.files;

    if (file) {
      const blog = await Rent.findById(id);
      // delete images first
      const allFiles = blog.display_image;
      for (const file of allFiles) {
        const result = await cloud.uploader.destroy(file.id);
        console.log(result);
      }
      const allpics = req.files;
      const pics = [];
      console.log(allpics);

      for (const file of allpics) {
        const { path } = file;
        const result = await cloud.uploader.upload(path);
        pics.push({ url: result.secure_url, id: result.public_id });
      }

      console.log(pics);
      const request = await Rent.findByIdAndUpdate(id, {
        $set: {
          propertyType: propertyType,
          isFurnushed: isFurnushed,
          condition: condition,
          agencyfee: agencyfee,
          client: client,
          category: category,
          houseAddress: houseAddress,
          display_image: pics,
        },
      });
      console.log('this is the request : ', request);
      res.json({ mssg: 'property updated' });
    } else {
      const request = await Rent.findByIdAndUpdate(id, {
        $set: {
          propertyType: propertyType,
          isFurnushed: isFurnushed,
          condition: condition,
          agencyfee: agencyfee,
          client: client,
          houseAddress: houseAddress,
        },
      });
      console.log(request);
      res.json({ mssg: 'property updated' });
    }
  } catch (error) {
    res.status(400).send('cant update');
  }
};

const deleteRent = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Rent.findById(id);
    if (!blog) res.status(400).send('property doesnt exist');

    const allFiles = blog.display_image;
    for (const file of allFiles) {
      const result = await cloud.uploader.destroy(file.id);
      console.log(result);
    }
    await Rent.findByIdAndDelete(id);
    res.json({ id: id });
  } catch (error) {
    console.log(error);
    res.status(400).send('cant delete');
  }
};
module.exports = {
  createProduct,
  RentProperties,
  RentProperty,
  deleteRent,
  updateRent,
};
