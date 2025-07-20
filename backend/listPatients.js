const mongoose = require('mongoose');
const Patient = require('./models/Patient');
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

const listPatients = async () => {
  try {
    await connectDB();

    const patients = await Patient.find().select('_id firstName lastName email');
    
    console.log('Patients in database:');
    patients.forEach(patient => {
      console.log(`ID: ${patient._id}`);
      console.log(`Name: ${patient.firstName} ${patient.lastName}`);
      console.log(`Email: ${patient.email}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error listing patients:', error);
    process.exit(1);
  }
};

listPatients();
