// Getting the reference to all products
var prouctsRef = firebase.database().ref().child('Products');
var ordersRef = firebase.database().ref().child('order');

// Add on child added listener. Add to the list of products to be displayed
prouctsRef.on('child_added',function(snapshot) {
  var dataSet = [snapshot.val().productName,snapshot.val().productDescription,snapshot.val().productImage,snapshot.val().unitPrice,snapshot.val().unitWeight, snapshot.val().isActive,, snapshot.key];
  $('#product_list').append(`
        <tr><td>`+ snapshot.val().productName +`: </td><td><input type="text" id="`+ snapshot.key +`" value="0"></td></tr>
    `);
});


$('#place_adhoc').on('click', function(){
  var order_items = {};

  $('#product_list').find('tr').each(function(index, element){
    // get the text box
    var data = $(this).find('td').eq(1).children(0);

    pid = data.attr('id');
    qty = data.val();
    var buy_price;
    firebase.database().ref('Products/' + pid).once('value',function(snapshot) {
      buy_price = snapshot.val().unitPrice;
      // get the values to form a json
      product_details = {
            "ProductId" : pid,
            "Quantity" : qty,
            "BuyPrice" : buy_price
          };
      order_items[pid] = product_details;
      });
  });

  // add to order table
    ordersRef.push().set({
        Comments : $('#comment').val(),
        Products : order_items,
        isAdhocOrder: 'Y',
        totalAmount: 500,
        deliveryAddress: 'still static',
        getLastModifiedOn: 'still static',
        lastModifiedBy: 'still static',
        orderId: 'still static',
        orderStatus: 'still static',
        orderType: "O",
        placedBy: "FFWh22JfDubHcKBkwiGJou7vmY03",
        placedOn: "18 Feb 2018 5:00:21 p.m.",
        sellerId: "rBXYHazHW7VDjDU4j35UGqpf5HM2",
        sellerStatus: "",
      });
    
});