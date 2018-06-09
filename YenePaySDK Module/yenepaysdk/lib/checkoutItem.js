'use strict';

module.exports = function(itemId, itemName, price, quantity = 1, tax1 = null, tax2 = null, discount = null, handlingFee = null, deliveryFee = null)
    {
        var self = this;
        self.ItemId = itemId? itemId : '';
        self.ItemName = itemName;
        self.UnitPrice = price;
        self.Quantity = quantity;
        self.Discount = discount;
        self.HandlingFee = handlingFee;        
        self.DeliveryFee = deliveryFee;
        self.Tax1 = tax1;
        self.Tax2 = tax2;

        self.GetAsKeyValue = function(dict)
        {
            if (!dict)
                dict = {};

            dict["ItemId"] = self.ItemId;
            dict["ItemName"] = self.ItemName;
            dict["UnitPrice"] = self.UnitPrice;
            dict["Quantity"] = self.Quantity;
            dict["Discount"] = self.Discount;
            dict["HandlingFee"] = self.HandlingFee;
            dict["DeliveryFee"] = self.DeliveryFee;
            dict["Tax1"] = self.Tax1;
            dict["Tax2"] = self.Tax2;
            return dict;
        }
    }