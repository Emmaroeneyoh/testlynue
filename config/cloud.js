const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:'emmaroempire-com',
    api_key:'951785774252847',
    api_secret:'FT4e9SQilOylB5AstosaWqliUic',
})

module.exports = cloudinary