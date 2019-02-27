# YenePaySDK - nodejs

This library allows you to quickly and easily add YenePay as a payment method using nodejs

We encourage you to read through this README to get the most our of what this library has to offer. We want this library to be community driven and we really appreciate any support we can get from the community.

## Getting Started

These instructions will guide you on how to develop and test YenePay's payment method integration with your nodejs application. We have setup a sandbox environment for you to test and play around the integration process. To learn more about this, please visit our community site: https://community.yenepay.com/

## Pre-requisite

To add YenePay to your application and start collecting payments, you will first need to register on YenePay as a merchant and get your seller code. You can do that from https://www.yenepay.com/merchant

## Installation

Install the yenepaysdk module to your project using npm.

```npm install yenepaysdk```

and require the module in your project.

```var ypco = require('yenepaysdk');```

## Implementation

The ```ypco``` object exposes four APIs

_1.

```javascript
ypco.checkoutType
```

This object contains string values of the two checkout types (Express and Cart)

```javascript
ypco.checkoutType.Express 

ypco.checkoutType.Cart
```

_2.

```javascript
ypco.checkoutOptions = function(sellerCode, merchantOrderId = "", process = _checkoutType.Express, useSandbox = false, expiresAfter = null, successReturn = "", cancelReturn = "", ipnUrl = "", failureUrl = "")
```

This function returns a new instance of checkoutOptions class

_3.

```javascript
ypco.pdtRequestModel = function(pdtToken, transactionId, useSandbox = false)
```

This function returns a new instance of pdtRequestModel

_4.

```javascript
ypco.checkout
```

This object has four functions

i. 

```javascript
ypco.checkout.GetCheckoutUrlForExpress(checkoutOptions, checkoutItem)
```

This function returns a checkout url for an Express type of checkout. The input parameters are a checkoutOptions object and checkoutItem object

example of checkoutItem object

```javascript
    { 
        ItemName: 'Sample Item 1',
        UnitPrice: '350',
        DeliveryFee: '50',
        Discount: '10',
        Tax1: '7.50',
        Tax2: '0',
        HandlingFee: '0',
        Quantity: '1'
    }
```

A sample implementation of this method is shown below

```javascript
exports.CheckoutExpress = function(req, res) {
var sellerCode = "YOUR_USER_CODE_IN_YENEPAY";
var useSandbox = true; //set this false on your production environment


var successUrlReturn = "PAYMENT_SUCCESS_RETURN_URL";
var ipnUrlReturn = "PAYMENT_COMPLETION_NOTIFICATION_URL",
var cancelUrlReturn = "PAYMENT_CANCEL_RETURN_URL",
var failureUrl = "PAYMENT_FAILURE_RETURN_URL";
var expiresAfter = "NUMBER_OF_MINUTES_BEFORE_THE_ORDER_EXPIRES";
var orderId = "UNIQUE_ID_THAT_IDENTIFIES_THIS_ORDER_ON_YOUR_SYSTEM";

var checkoutOptions = ypco.checkoutOptions(sellerCode, orderId, ypco.checkoutType.Express, useSandbox, expiresAfter, successUrlReturn, cancelUrlReturn, ipnUrlReturn, failureUrl);
var checkoutItem = req.body;
var url = ypco.checkout.GetCheckoutUrlForExpress(checkoutOptions, checkoutItem);
res.redirect(url);
};
```

ii. 

```javascript
ypco.checkout.GetCheckoutUrlForCart(checkoutOptions, checkoutItems)
```

This function returns a checkout url for a Cart type of checkout. The input parameters are a checkoutOptions object and an array of checkoutItem. 

A sample implementation of this method is shown below

```javascript
exports.CheckoutCart = function(req, res) {
var sellerCode = "YOUR_USER_CODE_IN_YENEPAY";
var useSandbox = true; //set this false on your production environment


var successUrlReturn = "PAYMENT_SUCCESS_RETURN_URL";
var ipnUrlReturn = "PAYMENT_COMPLETION_NOTIFICATION_URL",
var cancelUrlReturn = "PAYMENT_CANCEL_RETURN_URL",
var failureUrl = "PAYMENT_FAILURE_RETURN_URL";
var expiresAfter = "NUMBER_OF_MINUTES_BEFORE_THE_ORDER_EXPIRES";
var orderId = "UNIQUE_ID_THAT_IDENTIFIES_THIS_ORDER_ON_YOUR_SYSTEM";

var checkoutOptions = ypco.checkoutOptions(sellerCode, '', ypco.checkoutType.Cart, useSandbox, expiresAfter, successUrlReturn, cancelUrlReturn, ipnUrlReturn, failureUrl);
var data = req.body;
var checkoutItems = data.Items;
var deliveryFee = 100;
var discount = 50;
var handlingFee = 30;
var totalPrice = 0, totalTax1 = 0, totalTax2 = 0;
checkoutItems.forEach(function(element) {
    totalPrice += element.UnitPrice * element.Quantity;
});
totalTax1 = 0.15*totalPrice; totalTax2 = 0.02*totalPrice;
checkoutOptions.SetOrderFees(deliveryFee, discount, handlingFee, totalTax1, totalTax2);
var url = ypco.checkout.GetCheckoutUrlForCart(checkoutOptions, checkoutItems);
res.json({ "redirectUrl" : url });
};
```

iii. 

```javascript
ypco.checkout.IsIPNAuthentic(ipnModel, useSandbox = false)
```

This method verifies the authenticity of the ipn msg received from yenepay when a payment is completed. A sample implementation of a method to receive and verify IPN is shown below

```javascript
exports.IPNDestination = function(req, res) {
var ipnModel = req.body;
var useSandbox = true; //set this false on your production environment
ypco.checkout.IsIPNAuthentic(ipnModel, useSandbox).then((data) => {
    //this means the ipn is verified and the status of the transaction is COMPLETED
    //mark the order as "Paid" or "Completed" here
})
.catch((err) => {
    //this means either the ipn verification failed or the ipn model is INVALIDs
});;
};
```

iv. 

```javascript
ypco.checkout.RequestPDT(pdtRequestModel)
```

This function sends a pdt request to yenepay api server to check the status of a transaction.
A sample implementation of sending a pdt request to check the status of a transaction is shown below

```javascript
var pdtToken = 'YOUR_UNIQUE_PDT_TOKEN';
var transactionId = 'TRANSACTION_ID_OF_THE_ORDER';
var useSandbox = true;
var pdtRequestModel = ypco.pdtRequestModel(pdtToken, transactionId, useSandbox);
ypco.checkout.RequestPDT(pdtRequestModel).then((pdtString) => {
    //the pdtString contains the status of the order
})
.catch((err) => {
    //something wrong happened
});;
```

## Deployment

When you are ready to take this to your production environment, just set the UseSandbox property of the CheckoutOptions object to false.





