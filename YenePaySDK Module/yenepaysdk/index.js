'use strict';

const _checkoutItem = require('./lib/checkoutItem');
const _checkoutOptions = require('./lib/checkoutOptions');
const _pdtRequestModel = require('./lib/pdtRequestModel');
const _checkoutType = require('./lib/checkoutType');
const querystring = require("querystring");
const extend =  require("deep-extend");
const request = require("request");


function yenepaycheckout(querystring, extend, request)
{
  const self = this;
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
          const item = new _checkoutItem();
          extend(item, checkoutItem);
          const dict = checkoutOptions.GetAsKeyValue(false);
          item.GetAsKeyValue(dict);
          const checkoutUrl = self.checkoutBaseUrlProd + "?" + self.querystring.stringify(dict);
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
            const dict = checkoutOptions.GetAsKeyValue(true);
            const checkoutUrl = self.checkoutBaseUrlProd + "?" + self.querystring.stringify(dict);
            if (checkoutOptions.UseSandbox)
                checkoutUrl = self.checkoutBaseUrlSandbox + "?" + self.querystring.stringify(dict);
                
            for (const i = 0; i < checkoutItems.length; i++)
            {
                const item = new _checkoutItem();
                extend(item, checkoutItems[i]);
                const itemDict = item.GetAsKeyValue(null);

                Object.keys(itemDict).forEach(function(key) {
                    const val = itemDict[key];
                    if(val){
                        const arr_obj = {};
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
            const ipnVerifyUrl = useSandbox ? self.ipnVerifyUrlSandbox : self.ipnVerifyUrlProd;
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
            const pdtUrl = pdtRequestModel.UseSandbox ? self.pdtUrlSandbox : self.pdtUrlProd;
            self.request({
                url:pdtUrl, 
                method:"POST",
                json:true,
                body:pdtRequestModel.GetPDTDictionary()
            },
                function (error, response, body) {                    
                    if (!error && response.statusCode == 200) {
                            const pdtJson = self.PDTStringToJSON(body);
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
        const pairs = pdtString.slice(0).split('&');
        const result = {};
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
 