'use strict';

const _checkoutItem = require('./lib/checkoutItem');
const _checkoutOptions = require('./lib/checkoutOptions');
const _pdtRequestModel = require('./lib/pdtRequestModel');
const _checkoutType = require('./lib/checkoutType');
const querystring = require('querystring');
const extend = require('deep-extend');
const request = require('request');

class yenepaycheckout {
  constructor(querystring, extend, request) {
    this.querystring = querystring;
    this.extend = extend;
    this.request = request;
    this.checkoutBaseUrlProd = 'https://www.yenepay.com/checkout/Home/Process/';
    this.checkoutBaseUrlSandbox = 'https://test.yenepay.com/Home/Process/';
    this.ipnVerifyUrlProd = 'https://endpoints.yenepay.com/api/verify/ipn/';
    this.ipnVerifyUrlSandbox = 'https://testapi.yenepay.com/api/verify/ipn/';
    this.pdtUrlProd = 'https://endpoints.yenepay.com/api/verify/pdt/';
    this.pdtUrlSandbox = 'https://testapi.yenepay.com/api/verify/pdt/';
  }

  GetCheckoutUrlForExpress(checkoutOptions, checkoutItem) {
    try {
      const item = new _checkoutItem();
      extend(item, checkoutItem);
      const dict = checkoutOptions.GetAsKeyValue(false);
      item.GetAsKeyValue(dict);
      let checkoutUrl = this.checkoutBaseUrlProd + '?' + this.querystring.stringify(dict);

      if (checkoutOptions.UseSandbox) {
        checkoutUrl = this.checkoutBaseUrlSandbox + '?' + querystring.stringify(dict);
      }

      return checkoutUrl;
    } catch (ex) {
      throw ex;
    }
  }

  GetCheckoutUrlForCart(checkoutOptions, checkoutItems) {
    try {
      const dict = checkoutOptions.GetAsKeyValue(true);
      let checkoutUrl = this.checkoutBaseUrlProd + '?' + this.querystring.stringify(dict);

      if (checkoutOptions.UseSandbox) {
        checkoutUrl = this.checkoutBaseUrlSandbox + '?' + this.querystring.stringify(dict);
      }

      for (let i = 0; i < checkoutItems.length; i++) {
        const item = new _checkoutItem();
        extend(item, checkoutItems[i]);
        const itemDict = item.GetAsKeyValue(null);

        Object.keys(itemDict).forEach((key) => {
          if (itemDict[key]) {
            checkoutUrl += '&Items[' + i + '].' + this.querystring.stringify({ [key]: val });
          }
        });
      }

      return checkoutUrl;
    } catch (ex) {
      throw ex;
    }
  }

  IsIPNAuthentic(ipnModel, useSandbox = false) {
    return new Promise((resolve, reject) => {
      const ipnVerifyUrl = useSandbox ? this.ipnVerifyUrlSandbox : this.ipnVerifyUrlProd;

      this.request(
        {
          url: ipnVerifyUrl,
          method: 'POST',
          json: true,
          body: ipnModel,
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) resolve(body);
          else reject(error);
        }
      );
    });
  }

  RequestPDT(pdtRequestModel) {
    return new Promise((resolve, reject) => {
      const pdtUrl = pdtRequestModel.UseSandbox ? this.pdtUrlSandbox : this.pdtUrlProd;

      this.request(
        {
          url: pdtUrl,
          method: 'POST',
          json: true,
          body: pdtRequestModel.GetPDTDictionary(),
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const pdtJson = this.PDTStringToJSON(body);
            resolve(pdtJson);
          } else reject(error);
        }
      );
    });
  }

  PDTStringToJSON(pdtString) {
    const pairs = pdtString.slice(0).split('&');
    const result = {};

    pairs.forEach((pair) => {
      pair = pair.split('=');
      result[pair[0]] = pair[1];
    });
    return JSON.parse(JSON.stringify(result));
  }
}

function checkoutOptions(
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
  return new _checkoutOptions(
    sellerCode,
    merchantOrderId,
    process,
    useSandbox,
    expiresAfter,
    successReturn,
    cancelReturn,
    ipnUrl,
    failureUrl
  );
}

function pdtRequestModel(pdtToken, transactionId, merchantOrderId, useSandbox = false) {
  return new _pdtRequestModel(pdtToken, transactionId, merchantOrderId, useSandbox);
}

module.exports = {
  checkout: new yenepaycheckout(querystring, extend, request),
  checkoutOptions,
  checkoutType: _checkoutType,
  pdtRequestModel,
};
