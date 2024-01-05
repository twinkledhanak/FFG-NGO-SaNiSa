// Getting the reference to all products
var prouctsRef = firebase.database().ref().child('Products');

// Initialising the datatable
// TODO: sort according to timestamp
var table = $('#products').DataTable ({
	data: data,
	columnDefs: [
  { targets: 2,
    render: function(data) {
      return '<img width=50 height=50 src="'+data+'">'
    }
  },
  { targets: 5,
    render: function(data) {
      if (data == "Y"){
        return '<button type="button" class="btn btn-success waves-effect activeInactive">ACTIVE</button>'
      } else {
        return '<button type="button" class="btn btn-danger waves-effect activeInactive">INACTIVE</button>'
      }
    }
  },
  { targets: 6,
    render: function(data) {
      return '<button type="button" class="btn btn-primary waves-effect edit-product" data-toggle="modal" data-target="#editModal">EDIT</button>'
    }
  } 
  ],
  "order": [[ 3, "desc" ]],
  responsive: true,
  dom: 'Bfrtip',
  buttons: [
  'copy', 'csv', 'excel', 'pdf', 'print'
  ]
});

// Add on child added listener. Add to the list of products to be displayed
prouctsRef.on('child_added',function(snapshot) {
  var dataSet = [snapshot.val().productName,snapshot.val().productDescription,snapshot.val().productImage,snapshot.val().unitPrice,snapshot.val().unitWeight, snapshot.val().isActive,, snapshot.key];
  table.rows.add([dataSet]).draw();
});


// Toggling the product active inactive and assigning values to edit model
$('#products tbody').on( 'click', 'button', function () {
  console.log("Button clicked");
  //get the row data
  var rowData = table.row( $(this).parents('tr') ).data();
  var productId = rowData[7];
  console.log("Product is: "+ productId);

  // get clicked user data from database
  var data;
  firebase.database().ref('Products/' + productId).once('value',function(snapshot) {
    data = [snapshot.val().productName,snapshot.val().productDescription,snapshot.val().productImage,snapshot.val().unitPrice,snapshot.val().unitWeight, snapshot.val().isActive,, snapshot.key];
  });
  console.log("Current product data is: " + data);

  if($(this).attr("class").includes("activeInactive")){
    // toggle active
    if (data[5] == "Y") {
      console.log("Its active");
      // update in db
      firebase.database().ref('Products/' + productId).update({
        isActive: "N"
      });
      //update in UI
      $(this).text("INACTIVE");
      $(this).removeClass("btn-success").addClass("btn-danger");
    } else if (data[5] == "N") {
      console.log("Its inactive");
      // update in db
      firebase.database().ref('Products/' + productId).update({
        isActive: "Y"
      });
      //update in UI
      $(this).text("ACTIVE");
      $(this).removeClass("btn-danger").addClass("btn-success");
    }
  }

  if($(this).attr("class").includes("edit-product")){
    console.log('Lets edit it');
    // set id
    $('#productId').val(productId);
    // set name
    $('#edit_name').val(rowData[0]);
    // set description
    $('#edit_description').val(rowData[1]);
    // set price
    $('#edit_price').val(rowData[3]);
    // set weight
    $('#edit_weight').val(rowData[4]);
    // set image url
    $('#edit_product_image_url').val(rowData[2]);
  }
});

// update order 
$('#btn_edit_product').on( 'click', function () {
  console.log("update Button clicked");
  // get productId to be updated
  var productToUpdate = $('#productId').val();
  var date = new Date($.now()).toDateString();

  firebase.database().ref('Products/'+ productToUpdate).update({
    lastModifiedBy : loggedInUserUID,
    lastModifiedOn : date,
    productDescription : $("#edit_description").val(),
    productImage : $('#edit_product_image_url').val(),
    productName : $("#edit_name").val(),
    unitPrice : $("#edit_price").val(),
    unitWeight : $("#edit_weight").val()
  });

  location.reload();
});

// add order
$('#btn_add_product').on( 'click', function () {
  console.log("add Button clicked");
  // get form data and call firebase set
  var newProduct = firebase.database().ref('Products').push();
  var date = new Date($.now()).toDateString();
  console.log(date);
  productImageURL = $('#add_product_image_url').val();

  newProduct.set({
    createdBy : loggedInUserUID,
    createdOn : date,
    isActive : "Y",
    lastModifiedBy : loggedInUserUID,
    lastModifiedOn : date,
    pCode : $("#add_name").val().slice(0, 3).toUpperCase(),
    productDescription : $("#add_description").val(),
    productImage : productImageURL,
    productName : $("#add_name").val(),
    unitPrice : $("#add_price").val(),
    unitWeight : $("#add_weight").val()
  });
});

//-======================STORAGE code for add=====================

// get storage reference
var fileButton = document.getElementById('add_image');
var uploadStatus = $('#add_upload_progress');

fileButton.addEventListener('change', function(e){
  console.log('state_changed');
    // get file
    var selectedFile = e.target.files[0];
    // create storage ref
    var storageRef = firebase.storage().ref('Images/' + selectedFile.name);
    // upload file
    var task = storageRef.put(selectedFile);
    //update progress bar
    task.on('state_changed', 
      function progress(snapshot){
        var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        uploadStatus.css('width', percentage+'%');
        uploadStatus.html(percentage+'%');
      },
      function error(err){
        console.log(err);
      },
      function complete(){
        console.log('successfully uploaded');
      });

    task.then(function(snapshot){
      $('#add_product_image_url').val(snapshot.downloadURL);
      console.log(snapshot.downloadURL);
    });
  });


//-======================STORAGE code for update=====================

// get storage reference
var fileButton_edit = document.getElementById('edit_image');
var uploadStatus_edit = $('#edit_upload_progress');

fileButton_edit.addEventListener('change', function(e){
  console.log('state_changed');
    // get file
    var selectedFile_edit = e.target.files[0];
    // create storage ref
    var storageRef_edit = firebase.storage().ref('Images/' + selectedFile_edit.name);
    // upload file
    var task_edit = storageRef_edit.put(selectedFile_edit);
    //update progress bar
    task_edit.on('state_changed', 
      function progress(snapshot){
        var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        uploadStatus_edit.css('width', percentage+'%');
        uploadStatus_edit.html(percentage+'%');
      },
      function error(err){
        console.log(err);
      },
      function complete(){
        console.log('successfully uploaded');
      });

    task_edit.then(function(snapshot){
      $('#edit_product_image_url').val(snapshot.downloadURL);
      console.log(snapshot.downloadURL);
    });
  });