'use strict';

var _checkoutItem = require('./lib/checkoutItem');
var _checkoutOptions = require('./lib/checkoutOptions');
var _pdtRequestModel = require('./lib/pdtRequestModel');
var _checkoutType = require('./lib/checkoutType');
var querystring = require("querystring");
var extend =  require("deep-extend");
var request = require("request");


function yenepaycheckout(querystring, extend, request)
{
  var self = this;
  self.querystring = querystring;
  self.extend = extend;
  self.request = request;
  self.checkoutBaseUrlProd = "https://www.yenepay.com/checkout/Home/Process/";
  self.checkoutBaseUrlSandbox = "https://test.yenepay.com/Home/Process/";
  self.ipnVerifyUrlProd = "https://endpoints.yenepay.com/api/verify/ipn/";
  self.ipnVerifyUrlSandbox = "https://testapi.yenepay.com/api/verify/ipn/";
  self.pdtUrlProd = "https://endpoints.yenepay.com/api/verify/pdt/";
  self.pdtUrlSandbox = "https://testapi.yenepay.com/api/verify/pdt/";
  
  
  self.GetCheckoutUrlForExpress = function(checkoutOptions, checkoutItem)
  {
    try
      {
          var item = new _checkoutItem();
          extend(item, checkoutItem);
          var dict = checkoutOptions.GetAsKeyValue(false);
          item.GetAsKeyValue(dict);
          var checkoutUrl = self.checkoutBaseUrlProd + "?" + self.querystring.stringify(dict);
          if (checkoutOptions.UseSandbox)
              checkoutUrl = self.checkoutBaseUrlSandbox + "?" + querystring.stringify(dict);
          return checkoutUrl;
      }
      catch (ex)
      {
          throw ex;
      }
  }

    self.GetCheckoutUrlForCart = function(checkoutOptions, checkoutItems)
    {
        try
        {
            var dict = checkoutOptions.GetAsKeyValue(true);
            var checkoutUrl = self.checkoutBaseUrlProd + "?" + self.querystring.stringify(dict);
            if (checkoutOptions.UseSandbox)
                checkoutUrl = self.checkoutBaseUrlSandbox + "?" + self.querystring.stringify(dict);
                
            for (var i = 0; i < checkoutItems.length; i++)
            {
                var item = new _checkoutItem();
                extend(item, checkoutItems[i]);
                var itemDict = item.GetAsKeyValue(null);

                Object.keys(itemDict).forEach(function(key) {
                    var val = itemDict[key];
                    if(val){
                        var arr_obj = {};
                        arr_obj[key] = val;
                        checkoutUrl += '&Items[' + i + '].' + self.querystring.stringify(arr_obj);
                    }
                });
            }
            
            return checkoutUrl;
        }
        catch (ex)
        {
            throw ex;
        }
    }

    self.IsIPNAuthentic = function(ipnModel, useSandbox = false)
    {
        return new Promise(function(resolve, reject){
            var ipnVerifyUrl = useSandbox ? self.ipnVerifyUrlSandbox : self.ipnVerifyUrlProd;
            self.request({
                url:ipnVerifyUrl, 
                method:"POST",
                json:true,
                body:ipnModel
            },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                            resolve(body);
                        }
                    else{
                            reject(error);
                        }
                }
            );            
        });        
    }

    self.RequestPDT = function (pdtRequestModel)
    {
         return new Promise(function(resolve, reject){
            var pdtUrl = pdtRequestModel.UseSandbox ? self.pdtUrlSandbox : self.pdtUrlProd;
            self.request({
                url:pdtUrl, 
                method:"POST",
                json:true,
                body:pdtRequestModel.GetPDTDictionary()
            },
                function (error, response, body) {                    
                    if (!error && response.statusCode == 200) {
                            var pdtJson = self.PDTStringToJSON(body);
                            resolve(pdtJson);
                        }
                    else{
                            reject(error);
                        }
                }
            );            
        }); 
    }
	
	self.PDTStringToJSON = function(pdtString){
        var pairs = pdtString.slice(0).split('&');
        var result = {};
        pairs.forEach(function(pair){
            pair = pair.split('=');
            result[pair[0]] = pair[1];
        });
        return JSON.parse(JSON.stringify(result));
    }
        
}

module.exports.checkout = new yenepaycheckout(querystring, extend, request);
module.exports.checkoutOptions = function(sellerCode, merchantOrderId = "", process = _checkoutType.Express, useSandbox = false, expiresAfter = null, successReturn = "", cancelReturn = "", ipnUrl = "", failureUrl = ""){
    return new _checkoutOptions(sellerCode, merchantOrderId, process, useSandbox, expiresAfter, successReturn, cancelReturn, ipnUrl, failureUrl);
};
module.exports.checkoutType = _checkoutType;
module.exports.pdtRequestModel = function(pdtToken, transactionId, merchantOrderId, useSandbox = false){
    return new _pdtRequestModel(pdtToken, transactionId, merchantOrderId, useSandbox);
}
 