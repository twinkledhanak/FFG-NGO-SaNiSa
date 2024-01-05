

// Getting the reference to all orders
var ordersRef = firebase.database().ref().child('Orders');

// Initialising the datatable
// TODO: sort according to timestamp
var table = $('#orders').DataTable ({
  "order": [[ 3, "desc" ]],
  responsive: true,
  dom: 'Bfrtip',
  buttons: [
  'copy', 'csv', 'excel', 'pdf', 'print'
  ]
});

// Add on child added listener
ordersRef.on('child_added',function(snapshot) {
  // console.log(snapshot.val().items.item1.buy_price)
  if (snapshot.val().orderStatus === undefined){
    orderStatus = "Not assigned.";
  } else {
    orderStatus = snapshot.val().orderStatus;
  }
  console.log(orderStatus);

  var dataSet = [snapshot.val().placedOn, snapshot.val().placedBy, snapshot.val().deliveryAddress, snapshot.val().orderType, snapshot.val().totalAmount, snapshot.val().sellerId, snapshot.val().orderStatus];
  table.rows.add([dataSet]).draw();
});

/* Formatting function for row details - modify as you need */
function format ( d ) {
	var items_table = '<div class="slider">'+
  '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    // TODO: show packets and kgs, bill date, bill number bill amount pay status
    for (var key in d[5]){
		// console.log(d[5].item1)
		items_table = items_table + 
		'<tr>'+
   // '<td>'+d[5].item1.pid+'</td>'+
   // '<td>'+d[5].item1.buy_price+'</td>'+
   // '<td>'+d[5].item1.qty+'</td>'+
   '</tr>';
 }

 items_table = items_table + '</table>' + '</div>';

 return items_table;
}


// On click listener on a row which expands to display more data
$('#orders tbody').on('click', 'td', function () {
  var tr = $(this).closest('tr');
  var row = table.row( tr );
  console.log('clicked');
  if ( row.child.isShown() ) {
            // This row is already open - close it
            $('div.slider', row.child()).slideUp( function () {
              row.child.hide();
              tr.removeClass('shown');
            } );
          }
          else {
            // Open this row
            row.child( format(row.data()), 'no-padding' ).show();
            tr.addClass('shown');

            $('div.slider', row.child()).slideDown();
          }
        } );