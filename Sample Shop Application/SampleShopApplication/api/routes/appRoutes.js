'use strict';
module.exports = function(app) {
  var home = require('../controllers/homeController');

  app.route('/Home/CheckoutExpress')
    .post(home.CheckoutExpress);
  app.route('/Home/CheckoutCart')
    .post(home.CheckoutCart);
  app.route('/Home/IPNDestination')
    .post(home.IPNDestination);
  app.route('/Home/PaymentSuccessReturnUrl')
    .get(home.PaymentSuccessReturnUrl);
  app.route('/Home/PaymentCancelReturnUrl')
    .get(home.PaymentCancelReturnUrl);
};