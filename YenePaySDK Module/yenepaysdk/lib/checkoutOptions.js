'use strict';

var _checkoutType = require('./checkoutType');

module.exports = function(sellerCode, merchantOrderId = "", process = _checkoutType.Express, useSandbox = false, expiresAfter = null, successReturn = "", cancelReturn = "", ipnUrl = "", failureUrl = "")
    {
        var self = this;
        self.UseSandbox = useSandbox;
        self.Process = process;
        self.MerchantId = sellerCode;
        self.SuccessUrl = successReturn;
        self.CancelUrl = cancelReturn;
        self.IPNUrl = ipnUrl;
        self.FailureUrl = failureUrl;
        self.ExpiresAfter = expiresAfter;
        self.MerchantOrderId = merchantOrderId;  
        self.TotalItemsDeliveryFee = null;
        self.TotalItemsTax1 = null;
        self.TotalItemsTax2 = null;
        self.TotalItemsDiscount = null;
        self.TotalItemsHandlingFee = null; 

        self.SetOrderFees = function(totalItemsDeliveryFee, totalItemsDiscount, totalItemsHandlingFee, totalItemsTax1, totalItemsTax2){
            self.TotalItemsDeliveryFee = totalItemsDeliveryFee;
            self.TotalItemsDiscount = totalItemsDiscount;
            self.TotalItemsHandlingFee = totalItemsHandlingFee;
            self.TotalItemsTax1 = totalItemsTax1;
            self.TotalItemsTax2 = totalItemsTax2;
        }

        self.GetAsKeyValue = function(forCart){
            var dic = {
                Process: self.Process,
                MerchantId: self.MerchantId,
                SuccessUrl: self.SuccessUrl,
                CancelUrl: self.CancelUrl,
                IPNUrl: self.IPNUrl,
                FailureUrl: self.FailureUrl,
                ExpiresAfter: self.ExpiresAfter,
                MerchantOrderId: self.MerchantOrderId                
            };
			if(forCart){
				dic.TotalItemsDeliveryFee = self.TotalItemsDeliveryFee;
                dic.TotalItemsTax1 = self.TotalItemsTax1;
                dic.TotalItemsTax2 = self.TotalItemsTax2;
                dic.TotalItemsDiscount = self.TotalItemsDiscount;
                dic.TotalItemsHandlingFee = self.TotalItemsHandlingFee;				
			}
            return dic;
        }     
    };