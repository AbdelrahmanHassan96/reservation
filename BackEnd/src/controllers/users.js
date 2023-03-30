const User = require('../db/models/user')
const jwt = require('jsonwebtoken');
const sendEmail  = require('../helper/nodemailer')

 class users 
 {
     //register
    static register = async (req,res)=>{
        const data =new User(req.body)
        try{
            await data.save()
            const token = await data.generateToken()
            await sendEmail(data);
            res.status(200).send({
                status:1,
                data:data,
                msg:'user register succ',
                token:token
            })
        }
        catch(e){
            res.status(500).send({
                status:0,
                data:e,
                msg:'error in data',
                token:""
            })
        }
    }
    //user login
    static login = async(req,res)=>{
        try{
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateToken()
            res.send({
                status:1,
                data:user,
                msg:"logged in",
                token: token
            })
        }
        catch(e){
            res.status(500).send({
                status:0,
                data:"",
                msg:"err in data",
                token:""
            })
        }
    }

    //send verification to the user
    static verifyMe = async(req,res)=>{
        const _id= req.user.id
        try{
            const user =await User.findById(_id);
            if(user.isEmailVerified==true){
                res.status(200).send({
                    status:2,
                    msg:"Email is Verified"
                })
            }else{
                await sendEmail(user);
                res.send({
                    status:1,
                    msg:"Sent Successfully",
            })
            }
            
        }
        catch(e){
            res.status(500).send({
                status:0,
                msg:"err in data",
            })
        }
        
    }
    //verify user
    static verify = async (req, res)=>{
        const _id= req.params.id;
        const token = req.params.token;

        try{
            const user = await User.findById(_id);
            if(!user) throw new Error;
            if(user.isEmailVerified==true){
                res.status(200).send({
                    status:2,
                    msg:"Email is verified"
                })
            }
            jwt.verify(token, 'ourSecretKey', function(err, decoded) {
                if (err) {
                    console.log(err);
                    res.status(200).send({
                        status:3,
                        msg:"error in verify"
                    });
                }
                else {
                    user.isEmailVerified=true;
                    user.save();
                    res.status(200).send({
                        status:1,
                        msg:"Email verifified successfully"
                    });
                }
            });
        }catch(e){
            res.status(500).send({
                status:0,
                data:"",
                msg:"err in data",
            })
        }     
    };
    //get profile
    static profile = async(req,res)=>{

        console.log('profile')
        try{
            console.log('profile')
            res.statue(200).send({
                data: req.data,
                status:1
            })
        }
        catch(e){
            res.status(500).end({
                data:'',
                status:0
                
            })
        }
    }
    //edit user profile
    static editProfile = async(req,res)=>{
        const _id= req.params.id
        const updates = req.body
        const updatesKeys = Object.keys(req.body)
        const allowedUpdates = ["user_name","user_password","user_phone"]
        const validUpdates = updatesKeys.every((u)=>allowedUpdates.includes(u))
        if(!validUpdates)
            res.status(400).send({
                status:3,
                data:'',
                msg:'invalid updates'
            })
        try{
            const user = await User.findByIdAndUpdate(_id, updates,{
                new:true,
                runValidators:true
            })
            if(!user){
                res.status(200).send({
                    status:2,
                    data:"",
                    msg:"user not found"
                })
            }
            res.status(200).send({
                status:1,
                data: user, 
                msg:"user data retreived successfuly"
            })
        }
        catch(e){
            res.status(500).send({
                statue: 0,
                data:'',
                msg:"error edit data"
            })
        }
    }
    // delete user by id
    static deleteUser = async(req,res)=>{
        const _id= req.params.id
        try{
            const user = await User.findByIdAndDelete(_id)
            if(!user){
                res.status(200).send({
                    status:2,
                    data:"",
                    msg:"user not found"
                })
            }
            res.status(200).send({
                status:1,
                data: user, 
                msg:"user data deleted successfuly"
            })
        }
        catch(e){
            res.status(500).send({
                statue: 0,
                data:'',
                msg:"error delete data"
            })
        }
    }
    //get all users
    static allUsers = async (req,res)=>{
        try{
            role =await req.data.user_role
            if (!role==2) throw new Error('not admin')
            const users = await User.find({})
            res.status(200).send({
                status:1,
                data: users,
                msg: 'all users selected',
                me: req.data
            })
        }
        catch(e){
            res.status(500).send({
                status:0,
                data: e,
                msg: 'error loading users data'
            })
        }
    }
    //logout
    static logOut = async(req,res)=>{
        try{
            //req.user , req.token
            req.user.tokens = req.user.tokens.filter(
                t => t.token != req.token 
            )
            await req.user.save()
            res.status(200).send({
                status:1,
                data:'',
                msg:"logged out",
            })
        }
        catch(e){
            res.status(500).end({
                status:0,
                data:e,
                msg:'error in data',                
            })
        }
    }
    //logout from all
    static logOutAll = async(req,res)=>{
        try{
            //req.user , req.token
            req.user.tokens = []
            await req.user.save()
            res.status(200).send({
                status:1,
                data:'',
                msg:"logged out",
            })
        }
        catch(e){
            res.status(500).end({
                status:0,
                data:e,
                msg:'error in data',                
            })
        }
    }
 }
 module.exports = users 