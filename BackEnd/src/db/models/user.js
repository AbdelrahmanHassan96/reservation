const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
 
    email:{
        type:String,
        required: true,
        unique: true,
        trim:true,
        minLength:1,
        maxLength:80,
        validate(value){
            if(!validator.isEmail(value)) throw new Error ('invalid email')
        }
    },
    password:{
        type:String,
        minLength:6,
        maxLength:100,
        trim:true ,
        required:true
        // validate(value){
        //     //check password strong
        // }
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    tokens :[
        { 
            token:{ type:String}   
        }
    ]
    
},
{ timestamps: true }
)
UserSchema.virtual('reservation',{
    ref:'reservation',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.toJSON=function(){
    const user = this
    const userOBJ = user.toObject()
    delete userOBJ.user_password
    return userOBJ
}

UserSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 11)
    next()
})
UserSchema.statics.findByCredentials = async function(email,password){
    const user= await User.findOne({ email })
    if(!user) throw new Error('unauthorized')
    const matched = await bcrypt.compare(password, user.password)
    if(!matched) throw new Error('unauthorized')
    //if (!user.status) throw new Error('you are blocked please contact with admin')
    return user    
}

UserSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWTKEY);
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

const User = mongoose.model('User', UserSchema)
module.exports = User

