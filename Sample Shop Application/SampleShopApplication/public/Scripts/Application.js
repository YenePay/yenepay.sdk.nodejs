$(document).ready(function () {
    var counter = 0;
    var Items = new Array();
    $('.sub').click(function (e) {
        var element = $(this);
        var ItemName = element.parent().children("input[name=ItemName]").val();
        var ItemId = element.parent().children("input[name=ItemId]").val();
        var UnitPrice = element.parent().children("input[name=UnitPrice]").val();
        var Quantity = element.parent().children("input[name=Quantity]").val();
        counter++;
        $("img[id=index-para]").append().css("border", "3px solid red");
        $("p[id=index-p]").html("#Items: "+counter);
        var item = {
            'ItemId': ItemId,
            'ItemName': ItemName,
            'UnitPrice': UnitPrice,
            'Quantity': Quantity  
        };

        Items.push(item);
        
    });
    
    $('#checkout').click(function () {
        $.ajax({
            type: "POST",
            dataType: "json",
            url: cartUrl,
            contentType: "application/json",
            data: JSON.stringify({ 'Items': Items }),
            success: function (data) {
                if (data) {
                    // alert(data.redirectUrl);                    
                   window.location = data.redirectUrl;
                }
            },
            error: function (xhr, status, text) {
               
            }

        });
    });
});