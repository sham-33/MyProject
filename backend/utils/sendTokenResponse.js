// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, userType) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from output
  const userData = user.toObject();
  delete userData.password;
  delete userData.resetPasswordToken;
  delete userData.resetPasswordExpire;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      userType,
      user: userData
    });
};

module.exports = sendTokenResponse;
