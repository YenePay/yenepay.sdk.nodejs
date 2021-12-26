'use strict';


var ypco = require('yenepaysdk');

var sellerCode = "YOUR_YENEPAY_SELLER_CODE",
    successUrlReturn = "http://localhost:3000/Home/PaymentSuccessReturnUrl", //"YOUR_SUCCESS_URL",
    ipnUrlReturn = "http://localhost:3000/Home/IPNDestination", //"YOUR_IPN_URL",
    cancelUrlReturn = "", //"YOUR_CANCEL_URL",
    failureUrlReturn = "", //"YOUR_FAILURE_URL",
    pdtToken = "YOUR_PDT_KEY_HERE",
    useSandbox = true,
    currency = "USD";
    

exports.CheckoutExpress = function(req, res) {
  var merchantOrderId = '12-34'; //"YOUR_UNIQUE_ID_FOR_THIS_ORDER";  //can also be set null
  var expiresAfter = 2880; //"NUMBER_OF_MINUTES_BEFORE_THE_ORDER_EXPIRES"; //setting null means it never expires
  var checkoutOptions = ypco.checkoutOptions(sellerCode, merchantOrderId, ypco.checkoutType.Express, useSandbox, expiresAfter, successUrlReturn, cancelUrlReturn, ipnUrlReturn, failureUrlReturn, currency);
  var checkoutItem = req.body;
  var url = ypco.checkout.GetCheckoutUrlForExpress(checkoutOptions, checkoutItem);
  res.redirect(url);
};

exports.CheckoutCart = function(req, res) {
  var merchantOrderId = 'ab-cd'; //"YOUR_UNIQUE_ID_FOR_THIS_ORDER";  //can also be set null
  var expiresAfter = 2880; //"NUMBER_OF_MINUTES_BEFORE_THE_ORDER_EXPIRES"; //setting null means it never expires
  var checkoutOptions = ypco.checkoutOptions(sellerCode, merchantOrderId, ypco.checkoutType.Cart, useSandbox, expiresAfter, successUrlReturn, cancelUrlReturn, ipnUrlReturn, failureUrlReturn);
  var data = req.body;
  var checkoutItems = data.Items;

  //set order level fees like discount, handling fee, tax and delivery fee here
  var totalItemsDeliveryFee = 100;
  var totalItemsDiscount = 50;
  var totalItemsHandlingFee = 30;
  var totalPrice = 0;
  checkoutItems.forEach(function(element) {
    totalPrice += element.UnitPrice * element.Quantity;
  });
  var totalItemsTax1 = 0.15*totalPrice;
  var totalItemsTax2 = 0; //0.02*totalPrice; 
  ///////////////////////////////////////////////////////////////

  checkoutOptions.SetOrderFees(totalItemsDeliveryFee, totalItemsDiscount, totalItemsHandlingFee, totalItemsTax1, totalItemsTax2);
  var url = ypco.checkout.GetCheckoutUrlForCart(checkoutOptions, checkoutItems);
  res.json({ "redirectUrl" : url });
};

exports.IPNDestination = function(req, res) {
  var ipnModel = req.body;
  ypco.checkout.IsIPNAuthentic(ipnModel, useSandbox).then((ipnStatus) => {
    //This means the payment is completed
    //You can now mark the order as "Paid" or "Completed" here and start the delivery process
    res.json({"IPN Status": ipnStatus});
  })
  .catch((err) => {
    res.json({ "Error" : err });
  });
};

exports.PaymentSuccessReturnUrl = function(req, res) {
  var params = req.query;
  var pdtRequestModel = new ypco.pdtRequestModel(pdtToken, params.TransactionId, params.MerchantOrderId, useSandbox);
  console.log('success url called');
  ypco.checkout.RequestPDT(pdtRequestModel).then((pdtJson) => {
    if(pdtJson.result == 'SUCCESS') // or `pdtJson.Status == 'Paid'`
    {
      console.log("success url called - Paid");
      //This means the payment is completed. 
      //You can extract more information of the transaction from the pdtResponse
      //You can now mark the order as "Paid" or "Completed" here and start the delivery process
    }
    res.redirect('/');
  })
  .catch((err) => {
    //This means the pdt request has failed.
	  //possible reasons are 
      //1. the TransactionId is not valid
      //2. the PDT_Key is incorrect

    res.redirect('/');
  });
};

exports.PaymentCancelReturnUrl = function(req, res) {
  var params = req.query;
  var pdtRequestModel = new ypco.pdtRequestModel(pdtToken, params.TransactionId, params.MerchantOrderId, useSandbox);
  ypco.checkout.RequestPDT(pdtRequestModel).then((pdtJson) => {
    if(pdtJson.Status = 'Canceled')
    {
      //This means the payment is canceled. 
      //You can extract more information of the transaction from the pdtResponse
      //You can now mark the order as "Canceled" here.
    }
    res.json({"result":pdtJson.result});
  })
  .catch((err) => {
    //This means the pdt request has failed.
	  //possible reasons are 
      //1. the TransactionId is not valid
      //2. the PDT_Key is incorrect

     res.json({"result": "Failed"});
  });
};
