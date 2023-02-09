const jwt = require("jsonwebtoken");


const auth_check = (permission) => {
   return (req, res, next) => {
        const toke = req.cookies.admin;
    
        if(toke) {
            jwt.verify(toke,'admin', (err, decodedToken) => {
                if(err) {
                    console.log('this is invalid token ' ,err.message)
                   res.status(400).json({error:"token expired"})  
                } else {
                    console.log('this is token ; ', decodedToken)
                    const role = decodedToken.user.role
                    console.log(role)

                    if (permission.includes(role)) {
                        console.log(role, 'has been accepted')
                        next()
                    } else {
                       return res.json({error:'you are not authorize for this request'})
                    }
                }
            } )
        } else {
            res.json({error:"user not loged in"})
        }
    }
    
    
}





const user_check = (req, res, next) => {
    const toke = req.cookies.user;

    if(toke) {
        jwt.verify(toke,'user', (err, decodedToken) => {
            if(err) {
                console.log('this is invalid token ' ,err.message)
               res.json({error:"token expired"})  
            } else {
                console.log('this is token ; ', decodedToken)
                
            }
        } )
    } else {
        res.json({error:"user not loged in"})
    }
}







module.exports = {
  auth_check , user_check
};
