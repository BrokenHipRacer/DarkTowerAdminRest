const adminUsersApi = require('../routes/admin-user/api.js');

module.exports = {
  authAdminUser: function(req, res, next) {
    const cookies = req.cookies.adminUser ? req.cookies.adminUser.split('&') : null;

    const authUserId = cookies ? cookies[0] : '';
    const authToken = cookies ? cookies[1] : '';

    if (!req.cookies || !cookies) {
      res.locals.authSuccess = false;
      next();
    } else {
      adminUsersApi.authenticateAdminUser(authUserId, authToken, function(apiResponse) {
        res.locals.authUserId = apiResponse.success ? authUserId : null;
        res.locals.authSuccess = !!apiResponse.success;
        next();
      });
    }
  },
};
