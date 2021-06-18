const path = require('path')
const Message = require('../database/models/MessageModel')
const User = require('../database/models/UserModel')

class Actions{

    chat(req, res){
        res.sendFile( path.resolve(__dirname + '/../routes/chat/index.html'))
    }

    async signIn(req, res){
        const username = req.body.username
        const password = req.body.password

        let user
        try{
            user = new User({ username, password })
            await user.save()
        }catch(error){
            return res.status(422).json({ message: error.message })
        }

        res.status(201).json(user)
    }

    async login(req, res){
        
        User.findOne({
            username: req.body.username,
            password: req.body.password
        }, function (error, user){

            if(error)
                return res.status(422).json({ message: error.message })

            if(user === null)
            return res.status(422).json({ message: "user does not exist in the database!"})

            res.status(200).json({ _id: user._id })
        })

    }

    async sendMessage(req, res){
        const content = req.body.content
        const fromUser = req.body.fromUser

        let msg
        try{
            msg = new Message( { content, fromUser })
            await msg.save()
        }catch(error){
            return res.status(422).json( { message: error.message })
        }

        res.status(201).json(msg)
    }

}

module.exports = new Actions