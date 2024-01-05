// create reference for products
var productsRef = firebase.database().ref().child('Products');

// get the product names and ids
var products = [];
var productKeys = [];

productsRef.once('value',function(snapshot) {
  products.push(snapshot.val());
}).then(function(){
  columns_in_table = [{title: 'Sakhi Name'}];
  for (var i = products.length - 1; i >= 0; i--) {
    for(var key in products[i]){
      productKeys.push(key);
      columns_in_table.push({title: products[i][key]['productCode']});
    }
  }

  // console.log(columns_in_table);
  var table = $('#sakhi-inventory').DataTable( {
    columns: columns_in_table,
    responsive: true,
    dom: 'Bfrtip',
    buttons: [
    'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    columnDefs: [{ 
      targets: columns_in_table.length,
      render: function(data) {
        return '<button type="button" class="btn btn-primary waves-effect" data-toggle="modal" data-target="#editModal">EDIT</button>'
      }
    }]
  } );

  // go to inventory and get the count for the sakhi
  inventoryRef = firebase.database().ref().child('Inventory');
  usersRef = firebase.database().ref().child('Users');

// loop through inventory
inventoryRef.on('child_added', function(snapshot){
  var username;
  // get the user name
  firebase.database().ref('Users/' + snapshot.key).once('value').then(function(user_snapshot){
    username = user_snapshot.val().username;
    var dataSet = [username];

    // loop through products and check if the inventory has that product too. If yes then push to dataset
    for (var i = products.length - 1; i >= 0; i--) {
      for(var key in products[i]){
        // check if inventory has the product, yes then add qty to data set
        var count_inventory_for_this_product = snapshot.val().Products[key];
        if (typeof count_inventory_for_this_product != 'undefined'){
          dataSet.push(count_inventory_for_this_product);
        } else {
          dataSet.push(0);
        }
      }
    }
    dataSet.push(snapshot.key);
    table.rows.add([dataSet]).draw();
  });
});

// on click on edit
$('#sakhi-inventory').on( 'click', 'button', function () {
  //get the row data
  var rowData = table.row( $(this).parents('tr') ).data();
  console.log(rowData);

  // show user for whom the inventory is getting updated
  $('#form_edit_inventory').append(`
    <div class="form-group form-float">
      <div class="form-line">
        <input type="text" class="form-control" readonly>
        <label class="form-label">Updating inventory for: <b>`+ rowData[0] +`</b></label>
      </div>
    </div>`);

  // loop through all the products and append a text box for each with values
  for (var i = 1; i < columns_in_table.length; i++) {
    $('#form_edit_inventory').append(`
        <div class="row clearfix">
          <div class="col-lg-2 col-md-2 col-sm-4 col-xs-5 form-control-label">
              <label for="email_address_2">`+ columns_in_table[i]['title'] +`:</label>
          </div>
          <div class="col-lg-10 col-md-10 col-sm-8 col-xs-7">
              <div class="form-group">
                  <div class="form-line">
                      <input type="text" id="`+productKeys[i-1]+`" class="form-control" value=`+ rowData[i] +`>
                  </div>
              </div>
          </div>
        </div>`);
    }
   
   //on click of save, save the data to inventory table
   $('#save_inventory_changes').on('click', function(){
    console.log('save clicked');
    console.log(productKeys);
    // collect data to be updated
    var updates = [];
    for(var key in productKeys) {
      var pid = productKeys[key];
      updates[pid] = $('#'+pid).val();
    }
    console.log(updates);


    console.log('Updating for userid: ' + rowData[rowData.length-1] + ' Updates are: '+updates);
    inventoryRef.child(rowData[rowData.length-1] + '/Products').set(updates);

    // clear form
    $('#form_edit_inventory').empty();
    location.reload();
   });

   //on click of discard
   $('#discard_inventory_changes').on('click', function(){
    // remmove all textboxes from the form
    $('#form_edit_inventory').empty();
   });

});

});

