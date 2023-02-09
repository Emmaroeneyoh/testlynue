const Ticket = require('../../modal/client_modal/ticket')
const Chat = require('../../modal/client_modal/chat')
const joi = require('joi')
const ObjectId = require("mongoose").Types.ObjectId;


const createTicket = async (req, res) => {
    console.log('this is req.body :', req.body)
    try {
        const { id } = req.params
        const {complain} = req.body
        const schema = joi.object({
            complain:joi.string(),
           
          })
          const { error } = schema.validate(req.body)
          if (error) return res.status(400).send(error.details[0].message)
        const newTicket = await new Ticket({
            complain: complain,
            user: id,
            
        })
        const saveTicket = await newTicket.save()
        console.log(saveTicket)

        res.json({mssg:'complain Ticket successfully created'})
    } catch (error) {
        console.log(error)
        res.status(400).send('error occured while sending complain ticket')
    }
}

const createChat = async (req, res) => {
    console.log('this is req.body :', req.body)
    try {
        const { id } = req.params //ticket id
        const {chat, userId} = req.body
        const schema = joi.object({
            chat:joi.string(),
            userId: joi.string().required(),
            id:joi.string(),
           
          })
          const { error } = schema.validate(req.body)
          if (error) return res.status(400).send(error.details[0].message)
        const newChat = await new Chat({
            ticket: id,
            user: userId,
            chat:chat
        })
        const saveChat = await newChat.save()
        console.log(saveChat)
        //updating the cooment of the post
        const allpost = await  Ticket.findByIdAndUpdate(id, {
            $push: {
                chat: {
                    id : saveChat._id
                }
            }
        })
        res.json({mssg:'chat sent successfully'})
    } catch (error) {
        console.log(error)
        res.status(400).send('error occured')
    }
}

const updateTicket = async (req, res) => {
    const { id } = req.params
    try {
        const newStatus = await Ticket.findByIdAndUpdate(id, {
            $set: {
                status:'resolved'
            }
        })
        res.json({ mssg: "status updated" })
    } catch (error) {
        console.log(error)
        res.status(400).send('error occcured')
    }
}

const AllTicket = async (req, res) => {
    const { id } = req.params //user id
    try {
        const tickets = await Ticket.find({user:id}).sort({createdAt: -1}).populate({ path:'chat', select: 'chat' })
        res.json(tickets)
    } catch (error) {
        console.log(error)
        res.status(400).send('error occcured')
    }
}

const SingleTicket = async (req, res) => {
    const { id } = req.params //ticket id
    try {
        const tickets = await Ticket.findOne({_id:id}).sort({createdAt: -1}).populate({ path:'chat', select: 'chat' })
        res.json(tickets)
    } catch (error) {
        console.log(error)
        res.status(400).send('error occcured')
    }
}

const AllUserTicket = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({createdAt: -1}).populate({ path:'chat', select: 'chat' })
        res.json(tickets)
    } catch (error) {
        console.log(error)
        res.status(400).send('error occcured')
    }
}



module.exports = {
    createTicket , createChat , updateTicket , AllTicket , AllUserTicket , SingleTicket
}