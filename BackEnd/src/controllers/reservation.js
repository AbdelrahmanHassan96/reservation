const Reservation = require('../db/models/reservation')

class reservations 
 {
    //add
    static add = async (req,res)=>{
        const data = new Reservation({
            day: req.body.day,
            start: req.body.start,
            end: req.body.end,
            duration: req.body.duration,
            password: req.body.password,
            owner:req.user._id            
        })
        const day = data.day
        const start = data.start
        const end = data.end;
        const duration = data.duration;
        try{           
            // check if duration more than two hour 
            if(duration>=120){
                if(data.password==''){
                    return res.status(200).send({
                        status:3,
                        data:{},
                        msg:'more than two hour required password',
                    })
                }
            }
            // check if new reservation intersects with existing reservations
            const reservation = await Reservation.find({
                day: day,
                $or: [
                    { $and: [{ start: { $lte: start } }, { end: { $gt: start } }] },
                    { $and: [{ start: { $lt: end } }, { end: { $gte: end } }] },
                    { $and: [{ start: { $gte: start } }, { end: { $lte: end } }] },
                ]
            })
            if(reservation.length>0){
                console.log("full")
                res.status(200).send({
                    status:2,
                    data:{},
                    msg:'reservation intersects with existing reservations',
                })
            }else{
                await data.save()
                res.status(200).send({
                    status:1,
                    data:data,
                    msg:'reservation add succ',
                })
            } 
        }
        catch(e){
            res.status(500).send({
                status:0,
                data:e,
                msg:'error in data',
            })
        }
    }   
    //delete reservation 
    static delete = async (req,res)=>{
        const _id= req.params.id
        const owner = req.user._id
        try{
            const reservation = await Reservation.findByIdAndDelete({_id,owner})
            if(!reservation){
                res.status(200).send({
                    status:2,
                    data:"",
                    msg:"reservation not found"
                })
            }else{
                res.status(200).send({
                    status:1,
                    data: reservation, 
                    msg:"reservation data deleted successfuly"
                })
            }
        }
        catch(e){
            res.status(500).send({
                statue: 0,
                data:'',
                msg:"error delete data"
            })
        }
    }
    //get user reservation
    static showReservation = async (req,res)=>{
        const _id = req.user._id
        try {
          const reservation = await Reservation.find({owner:_id})
          if(reservation.length<1){
            res.status(200).send({
                status:2,
                data:"",
                msg:"reservation not found"
            })
        }else{
            res.status(200).send({
                status:1,
                data: reservation, 
                msg:"reservation data deleted successfuly"
            })
        }
        } catch (e) {
          res.status(500).send({
            status:0,
            data:'',
            msg:'error in load reservation'
          })
        }
      
    }
    //get week schedle
    static getWeekSchedle = async(req,res)=>{
        try{

            // get start and end dates of current week
            const today = new Date();
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
            const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));

            // query database for reservations in current week
            const reservations = await Reservation.find({
            day: { $gte: startOfWeek, $lte: endOfWeek },
            }).
            sort({ day: 1, start: 1 });
            if(reservations.length > 0){
                res.status(200).send({
                    status:1,
                    data:reservations,
                    msg:'get data secc',
                })
            }else{
                res.status(200).send({
                    status:2,
                    data:"",
                    msg:'no data exist',
                })
            }

        }catch(e){
            res.status(500).send({
                status:0,
                data:e,
                msg:'error in data',
            })
        }
    }

 }
 module.exports = reservations 