const crypto = require('crypto');
const { validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const sendTokenResponse = require('../utils/sendTokenResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Register doctor
// @route   POST /api/doctors/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      specialization,
      licenseNumber,
      experience,
      education,
      hospital,
      consultationFee,
      availability,
      biography,
      languages,
      awards
    } = req.body;

    // Create doctor
    const doctor = await Doctor.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      specialization,
      licenseNumber,
      experience,
      education: education || [],
      hospital,
      consultationFee,
      availability: availability || [],
      biography,
      languages: languages || [],
      awards: awards || []
    });

    sendTokenResponse(doctor, 201, res, 'doctor');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login doctor
// @route   POST /api/doctors/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for doctor
    const doctor = await Doctor.findOne({ email }).select('+password');

    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await doctor.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    sendTokenResponse(doctor, 200, res, 'doctor');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in doctor
// @route   GET /api/doctors/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update doctor details
// @route   PUT /api/doctors/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      specialization: req.body.specialization,
      experience: req.body.experience,
      education: req.body.education,
      hospital: req.body.hospital,
      consultationFee: req.body.consultationFee,
      availability: req.body.availability,
      biography: req.body.biography,
      languages: req.body.languages,
      awards: req.body.awards
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during update'
    });
  }
};

// @desc    Update password
// @route   PUT /api/doctors/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('+password');

    // Check current password
    if (!(await doctor.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    if (!req.body.newPassword || req.body.newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    doctor.password = req.body.newPassword;
    await doctor.save();

    sendTokenResponse(doctor, 200, res, 'doctor');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/doctors/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ email: req.body.email });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'There is no doctor with that email'
      });
    }

    // Get reset token
    const resetToken = doctor.getResetPasswordToken();

    await doctor.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/doctor/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) has requested the reset of a password.
      Please click on the following link to reset your password:
      
      ${resetUrl}
      
      If you did not request this, please ignore this email and your password will remain unchanged.
      
      This link will expire in 10 minutes.
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click on the following button to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>Important:</strong> This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: doctor.email,
        subject: 'Password Reset Token - Hospital Portal (Doctor)',
        message,
        html
      });

      res.status(200).json({
        success: true,
        message: 'Email sent successfully'
      });
    } catch (err) {
      console.log(err);
      doctor.resetPasswordToken = undefined;
      doctor.resetPasswordExpire = undefined;

      await doctor.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/doctors/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const doctor = await Doctor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Set new password
    doctor.password = req.body.password;
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordExpire = undefined;
    await doctor.save();

    sendTokenResponse(doctor, 200, res, 'doctor');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Get all doctors (public)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    let query = { isActive: true };

    // Filter by specialization
    if (req.query.specialization) {
      query.specialization = req.query.specialization;
    }

    // Search by name
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const doctors = await Doctor.find(query)
      .select('-resetPasswordToken -resetPasswordExpire')
      .sort('firstName lastName');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single doctor (public)
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .select('-resetPasswordToken -resetPasswordExpire');

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout doctor / clear cookie
// @route   GET /api/doctors/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Doctor logged out successfully'
  });
};
