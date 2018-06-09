'use strict';

module.exports = function(pdtToken, transactionId, merchantOrderId, useSandbox = false)
    {
       var self = this;
        self.RequestType = "PDT";
        self.PdtToken = pdtToken;
        self.TransactionId = transactionId;
        self.MerchantOrderId = merchantOrderId;
        self.UseSandbox = useSandbox;

        self.GetPDTDictionary = function()
        {            
            var dic = {
                RequestType: self.RequestType,
                PdtToken: self.PdtToken,
                TransactionId: self.TransactionId,
                MerchantOrderId : self.MerchantOrderId
            };
            return dic;
        }
    }