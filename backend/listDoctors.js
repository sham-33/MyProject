const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const listDoctors = async () => {
  try {
    await connectDB();

    const doctors = await Doctor.find().select('_id firstName lastName email specialization availability');
    
    console.log('Doctors in database:');
    doctors.forEach(doctor => {
      console.log(`ID: ${doctor._id}`);
      console.log(`Name: Dr. ${doctor.firstName} ${doctor.lastName}`);
      console.log(`Email: ${doctor.email}`);
      console.log(`Specialization: ${doctor.specialization}`);
      console.log(`Availability: ${doctor.availability?.length || 0} days set`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error listing doctors:', error);
    process.exit(1);
  }
};

listDoctors();
