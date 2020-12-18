'use strict';

module.exports = class {
  constructor(pdtToken, transactionId, merchantOrderId, useSandbox = false) {
    this.RequestType = 'PDT';
    this.PdtToken = pdtToken;
    this.TransactionId = transactionId;
    this.MerchantOrderId = merchantOrderId;
    this.UseSandbox = useSandbox;
  }

  GetPDTDictionary() {
    const dic = {
      RequestType: this.RequestType,
      PdtToken: this.PdtToken,
      TransactionId: this.TransactionId,
      MerchantOrderId: this.MerchantOrderId,
    };
    return dic;
  }
};
