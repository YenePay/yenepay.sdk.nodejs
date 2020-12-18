'use strict';

module.exports = class {
  constructor(
    itemId,
    itemName,
    price,
    quantity = 1,
    tax1 = null,
    tax2 = null,
    discount = null,
    handlingFee = null,
    deliveryFee = null
  ) {
    this.ItemId = itemId ? itemId : '';
    this.ItemName = itemName;
    this.UnitPrice = price;
    this.Quantity = quantity;
    this.Discount = discount;
    this.HandlingFee = handlingFee;
    this.DeliveryFee = deliveryFee;
    this.Tax1 = tax1;
    this.Tax2 = tax2;
  }

  GetAsKeyValue(dict) {
    if (!dict) dict = {};

    dict['ItemId'] = this.ItemId;
    dict['ItemName'] = this.ItemName;
    dict['UnitPrice'] = this.UnitPrice;
    dict['Quantity'] = this.Quantity;
    dict['Discount'] = this.Discount;
    dict['HandlingFee'] = this.HandlingFee;
    dict['DeliveryFee'] = this.DeliveryFee;
    dict['Tax1'] = this.Tax1;
    dict['Tax2'] = this.Tax2;
    return dict;
  }
};
