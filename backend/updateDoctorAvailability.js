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

const updateDoctorAvailability = async () => {
  try {
    await connectDB();

    // Default availability (Monday to Friday, 9 AM to 5 PM)
    const defaultAvailability = [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'friday', startTime: '09:00', endTime: '17:00' },
      { day: 'saturday', startTime: '09:00', endTime: '13:00' }
    ];

    // Find doctors without availability or with empty availability
    const doctors = await Doctor.find({
      $or: [
        { availability: { $exists: false } },
        { availability: { $size: 0 } }
      ]
    });

    console.log(`Found ${doctors.length} doctors without availability`);

    // Update each doctor with default availability
    for (const doctor of doctors) {
      doctor.availability = defaultAvailability;
      await doctor.save();
      console.log(`Updated availability for Dr. ${doctor.firstName} ${doctor.lastName}`);
    }

    console.log('All doctors updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    process.exit(1);
  }
};

updateDoctorAvailability();
