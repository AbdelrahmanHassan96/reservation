const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    default: '',
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'User'
  }
},
{timestamps:true}
);

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
