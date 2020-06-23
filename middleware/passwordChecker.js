exports.passwordChecker = function (password) {
  const lower = new RegExp('^(?=.*[a-z])');
  const upper = new RegExp('^(?=.*[A-Z])');
  const number = new RegExp('^(?=.*[0-9])');
  const char = new RegExp('(?=.*[!@#$%^&*])');

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (!lower.test(password)) {
    return 'Password must contain at least 1 lower case letter';
  }

  if (!upper.test(password)) {
    return 'Password must contain at least 1 upper case letter';
  }

  if (!number.test(password)) {
    return 'Password must contain at least 1 number';
  }

  if (!char.test(password)) {
    return 'Password must contain at least 1 special character';
  }
};
