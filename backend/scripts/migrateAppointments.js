const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
require('dotenv').config();

const migrateAppointments = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all appointments that still have the old 'reason' field
    const appointments = await Appointment.find({
      reason: { $exists: true },
      reasons: { $exists: false }
    });

    console.log(`Found ${appointments.length} appointments to migrate`);

    // Migrate each appointment
    for (const appointment of appointments) {
      // Only migrate if reason exists and is not empty
      if (appointment.reason && appointment.reason.trim()) {
        appointment.reasons = [{
          text: appointment.reason.trim(),
          date: appointment.createdAt || new Date()
        }];
        
        // Remove the old reason field
        appointment.reason = undefined;
        
        await appointment.save();
        console.log(`Migrated appointment ${appointment._id}`);
      } else {
        console.log(`Skipped appointment ${appointment._id} - no valid reason to migrate`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAppointments();
}

module.exports = migrateAppointments;
