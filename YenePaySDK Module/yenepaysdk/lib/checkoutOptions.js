'use strict';

const _checkoutType = require('./checkoutType');

module.exports = class {
  constructor(
    sellerCode,
    merchantOrderId = '',
    process = _checkoutType.Express,
    useSandbox = false,
    expiresAfter = null,
    successReturn = '',
    cancelReturn = '',
    ipnUrl = '',
    failureUrl = ''
  ) {
    this.UseSandbox = useSandbox;
    this.Process = process;
    this.MerchantId = sellerCode;
    this.SuccessUrl = successReturn;
    this.CancelUrl = cancelReturn;
    this.IPNUrl = ipnUrl;
    this.FailureUrl = failureUrl;
    this.ExpiresAfter = expiresAfter;
    this.MerchantOrderId = merchantOrderId;
    this.TotalItemsDeliveryFee = null;
    this.TotalItemsTax1 = null;
    this.TotalItemsTax2 = null;
    this.TotalItemsDiscount = null;
    this.TotalItemsHandlingFee = null;
  }

  SetOrderFees(
    totalItemsDeliveryFee,
    totalItemsDiscount,
    totalItemsHandlingFee,
    totalItemsTax1,
    totalItemsTax2
  ) {
    this.TotalItemsDeliveryFee = totalItemsDeliveryFee;
    this.TotalItemsDiscount = totalItemsDiscount;
    this.TotalItemsHandlingFee = totalItemsHandlingFee;
    this.TotalItemsTax1 = totalItemsTax1;
    this.TotalItemsTax2 = totalItemsTax2;
  }

  GetAsKeyValue(forCart) {
    const dic = {
      Process: this.Process,
      MerchantId: this.MerchantId,
      SuccessUrl: this.SuccessUrl,
      CancelUrl: this.CancelUrl,
      IPNUrl: this.IPNUrl,
      FailureUrl: this.FailureUrl,
      ExpiresAfter: this.ExpiresAfter,
      MerchantOrderId: this.MerchantOrderId,
    };
    
    if (forCart) {
      dic.TotalItemsDeliveryFee = this.TotalItemsDeliveryFee;
      dic.TotalItemsTax1 = this.TotalItemsTax1;
      dic.TotalItemsTax2 = this.TotalItemsTax2;
      dic.TotalItemsDiscount = this.TotalItemsDiscount;
      dic.TotalItemsHandlingFee = this.TotalItemsHandlingFee;
    }
    return dic;
  }
};
