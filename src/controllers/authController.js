const User = require('./../models/userModel');
const createSendToken = require('../utils/createSendToken');
const randomUtils = require('../utils/randomUtils');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const filterObj = require('../utils/filterObject');
const getMissingFields = require('../utils/getMissingFields');

exports.signup = catchAsync(async (req, res, next) => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  filteredBody.emailVerificationCode = randomUtils.generateNumericCode();
  filteredBody.emailVerificationExpiry = Date.now() + 10 * 60 * 1000;

  const newUser = User.create(filteredBody);

  // Send Email.

  res.status(201).json({
    status: 'success',
    message:
      "Signup successful! We've sent a verification code to your email. Please enter it to verify your account.",
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const requiredFields = ['email', 'emailVerificationCode'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const user = await User.findOne({ email: filteredBody.email });

  if (!user || user.isEmailVerified) {
    return next(new AppError('Invalid request', 400));
  }
  if (
    Date.now() > user.emailVerificationExpiry ||
    parseInt(filteredBody.emailVerificationCode) !== user.emailVerificationCode
  ) {
    return next(new AppError('Code expired or Invalid code', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = null;
  user.emailVerificationExpiry = null;

  await user.save();

  // Send Email.

  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const requiredFields = ['email', 'password'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const { email, password } = filteredBody;
  const user = await User.findOne({ email: email })
    .select('+password')
    .setOptions({ includeInactiveUsers: true });

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  if (!user.isActive) {
    return next(
      new AppError('Your account is deactivated, activate to login', 403)
    );
  }

  if (!user.isEmailVerified) {
    return next(new AppError('Verify your email address to continue', 403));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 1),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const requiredFields = ['passwordCurrent', 'password', 'passwordConfirm'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const user = await User.findById(req.user.id).select('+password');
  const isCorrectPassword = await user.checkPassword(
    filteredBody.passwordCurrent,
    user.password
  );
  if (!isCorrectPassword) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = filteredBody.password;
  user.passwordConfirm = filteredBody.passwordConfirm;
  await user.save();

  // Send Email.

  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const requiredFields = ['email'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const user = await User.findOne({ email: filteredBody.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/resetPassword/${resetToken}`;

    // Send Email.

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  const requiredFields = ['password', 'passwordConfirm'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  user.password = filteredBody.password;
  user.passwordConfirm = filteredBody.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Send Email.

  createSendToken(user, 200, res);
});

exports.resendEmailVerificationCode = catchAsync(async (req, res, next) => {
  const requiredFields = ['email'];
  const filteredBody = filterObj(req.body, ...requiredFields);
  const missingFields = getMissingFields(filteredBody, ...requiredFields);
  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400)
    );
  }

  const user = await User.findOne({ email: filteredBody.email });
  if (!user || user.isEmailVerified) {
    return next(new AppError('Invalid request', 400));
  }

  if (
    user.emailVerificationExpiry &&
    Date.now() < user.emailVerificationExpiry - 9 * 60 * 1000
  ) {
    return next(new AppError('Please wait before requesting again', 429));
  }

  if (user.emailCodeResendAttempts >= process.env.RESEND_ATTEMPTS) {
    await User.deleteOne({ _id: user._id });
    await new Email(user).sendDeletionDueToAbuseNotice();
    return res.status(403).json({
      status: 'failed',
      message:
        'Your account was removed due to too many failed verification attempts. Please sign up again if this was unintentional.',
    });
  }

  user.emailCodeResendAttempts += 1;
  user.emailVerificationCode = randomUtils.generateNumericCode();
  user.emailVerificationExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  // Send Email.

  res.status(200).json({
    status: 'success',
    message: 'Verification code resent to your email',
  });
});
