const User = require('../modal/client_modal/user')
const admin = require('../modal/admin_modal/admin')
const jwt = require('jsonwebtoken')

// for admins 
const admin_check = (permission) => {
    return (req, res, next) => {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
          try {
              token = req.headers.authorization.split(' ')[1] // gotten the token, now we will decode it

              const decoded = jwt.verify(token, 'admin')
              const role = decoded.user.userrole
                     console.log(role)
 
              if (permission.includes(role)) {
                  console.log(role, 'has been accepted')
                  next()
              
              } else {
                 return res.status(401).send('your role is not authorized for request')
                 
              }
          } catch (error) {
              console.log(error)
            return  res.status(400).send('not authorized')
          }
        }
        if (!token) {
          return  res.status(401).send('token unavailable')
        }
  }
    
    
}

// for users 
const user_check =  (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
          token = req.headers.authorization.split(' ')[1] // gotten the token, now we will decode it

          const decoded = jwt.verify(token, 'user')
          const role = decoded.user
                 console.log(role)

       next()
      } catch (error) {
          console.log(error)
          res.status(400).send('not authorized')
      }
    }
    if (!token) {
     return   res.status(401).send('token unavailable')
    }
}


module.exports = {
    admin_check , user_check
}




// // for normal webste
// const auth_check = (permission) => {
//     return (req, res, next) => {
//          const toke = req.cookies.admin;
     
//          if(toke) {
//              jwt.verify(toke,'Admin', (err, decodedToken) => {
//                  if(err) {
//                      console.log(err.message)
//                     res.status(400).send("token expired")
//                  } else {
//                      console.log('this is token ; ', decodedToken)
//                      const role = decodedToken.user.userrole
//                      console.log(role)
 
//                      if (permission.includes(role)) {
//                          console.log(role, 'has been accepted')
//                          next()
//                      } else {
//                         return res.status(400).send('you are not authorize for this request')
//                      }
//                  }
//              } )
//          } else {
//              res.status(400).send('user not logged in')
//              console.log('cookie dont exist')
//          }
//      }
     
     
//  }
 
//  const checkrole = (permission) => {
     
//      return (req, res, next) => {
         
//          const role = req.params.role
         
//          if (permission.includes(role)) {
//              console.log(role, 'has been accepted')
//              next()
//          } else {
//             return res.json({mssg:'you are nit athorizes'})
//          }
//     }
//  }

