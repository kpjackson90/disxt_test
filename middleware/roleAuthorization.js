const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.roleAuthorization = function (roles) {
  return function (req, res, next) {
    var user = req.user;

    User.findById(user._id, function (err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No User found.' });
        return next(err);
      }

      if (roles.indexOf(foundUser.role) > -1) {
        return next();
      }

      res
        .status(401)
        .json({ error: 'You are not authorized to view this content' });
    });
  };
};
