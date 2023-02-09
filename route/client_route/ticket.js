const router = require('express').Router()
const {admin_check , user_check} = require('../../config/authCheck')
const { createTicket , createChat  , updateTicket , AllTicket , AllUserTicket , SingleTicket} = require('../../controller/complain/ticket')

router.post('/complain/ticket/:id', user_check, createTicket)

router.get('/user/ticket/:id', user_check, AllTicket)
router.get('/complain/ticket', user_check , AllUserTicket)
router.get('/complain/ticket/:id', user_check ,  SingleTicket)
router.post('/chat/ticket/:id', user_check, createChat)

//for admins 

router.put('/admin/complain/ticket/:id', admin_check([ 'superadmin' , 'support']), updateTicket) //to change status from pending to resolved
router.get('/admin/user/ticket/:id', admin_check([ 'superadmin' , 'support']), AllTicket) // to get all the ticket of a particular user
router.get('/admin/complain/ticket',admin_check([ 'superadmin' , 'support']), AllUserTicket) // to get all the complain ticket
router.get('/complain/ticket/:id',admin_check([ 'superadmin' , 'support']),  SingleTicket) //to get all details of a particular ticket


module.exports = router