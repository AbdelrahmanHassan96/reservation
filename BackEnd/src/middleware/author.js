const jwt = require('jsonwebtoken')
const User = require('../db/models/user')
const auth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace("Bearer ","")
        const decodedToken = jwt.verify(token, process.env.JWTKEY)
        const user = await User.findOne({
            _id : decodedToken._id, 'tokens.token' : token
        })
        if(!user) throw new Error()
        req.token = token
        req.user = user
        next()
    }
    catch(e){
        res.status(500).send({
            status:0, 
            msg: "please auth",
            data: ""
        })
    }
}

const adminauth = async (req, res, next)=>{
    try{
        const token = req.header('Authorization').replace("Bearer ","")
        const decodedToken = jwt.verify(token, 'S[~M?V2WJ:#QNXKK')
        const data = await User.findOne({
            _id : decodedToken._id, 'tokens.token' : token
        })
        if(!data) throw new Error()
        if (!data.user_role==1) throw new Error ('not admin')
        req.token = token
        req.data = data
        next()
    }
    catch(e){
        res.status(500).send({
            status:0, 
            msg: "please auth",
            data: ""
        })
    }
}

module.exports = auth