const crypto = require('crypto');
const { validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const sendTokenResponse = require('../utils/sendTokenResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Register patient
// @route   POST /api/patients/register
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
      address,
      emergencyContact,
      medicalHistory,
      allergies
    } = req.body;

    // Create patient
    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      address,
      emergencyContact,
      medicalHistory: medicalHistory || [],
      allergies: allergies || []
    });

    sendTokenResponse(patient, 201, res, 'patient');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login patient
// @route   POST /api/patients/login
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

    // Check for patient
    const patient = await Patient.findOne({ email }).select('+password');

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password matches
    const isMatch = await patient.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!patient.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    sendTokenResponse(patient, 200, res, 'patient');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get current logged in patient
// @route   GET /api/patients/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update patient details
// @route   PUT /api/patients/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
      emergencyContact: req.body.emergencyContact,
      medicalHistory: req.body.medicalHistory,
      allergies: req.body.allergies
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: patient
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
// @route   PUT /api/patients/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.id).select('+password');

    // Check current password
    if (!(await patient.matchPassword(req.body.currentPassword))) {
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

    patient.password = req.body.newPassword;
    await patient.save();

    sendTokenResponse(patient, 200, res, 'patient');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during password update'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/patients/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ email: req.body.email });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'There is no patient with that email'
      });
    }

    // Get reset token
    const resetToken = patient.getResetPasswordToken();

    await patient.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/patient/${resetToken}`;

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
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>Important:</strong> This link will expire in 10 minutes.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: patient.email,
        subject: 'Password Reset Token - Hospital Portal',
        message,
        html
      });

      res.status(200).json({
        success: true,
        message: 'Email sent successfully'
      });
    } catch (err) {
      console.log(err);
      patient.resetPasswordToken = undefined;
      patient.resetPasswordExpire = undefined;

      await patient.save({ validateBeforeSave: false });

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
// @route   PUT /api/patients/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const patient = await Patient.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!patient) {
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
    patient.password = req.body.password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpire = undefined;
    await patient.save();

    sendTokenResponse(patient, 200, res, 'patient');
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Logout patient / clear cookie
// @route   GET /api/patients/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Patient logged out successfully'
  });
};
