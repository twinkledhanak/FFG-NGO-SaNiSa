// Getting the reference to all users
var usersRef = firebase.database().ref().child('Users');

// Initialising the datatable
// TODO: sort according to timestamp
var table = $('#users').DataTable ({
  "order": [[ 3, "desc" ]],
  responsive: true,
  dom: 'Bfrtip',
  buttons: [
  'copy', 'csv', 'excel', 'pdf', 'print'
  ],
  columnDefs: [
  { targets: 3,
    render: function(data) {
      if (data == "Sakhi"){
        return '<button type="button" class="btn btn-primary waves-effect userType">SAKHI</button>'
      } else {
        return '<button type="button" class="btn btn-default waves-effect userType">CLIENT</button>'
      }
    }
  },
  { targets: 4,
    render: function(data) {
      if (data == "Y"){
        return '<button type="button" class="btn btn-success waves-effect activeInactive">ACTIVE</button>'
      } else {
        return '<button type="button" class="btn btn-danger waves-effect activeInactive">INACTIVE</button>'
      }
    }
  }  
  ]
});

// Add on child added listener
usersRef.on('child_added',function(snapshot) {
  if (snapshot.val().firstName === undefined) {
    firstName = "Not in db";
  } else {
    firstName = snapshot.val().firstName;
  }
  if (snapshot.val().lastName === undefined) {
    lastName = "Not in db";
  } else {
    lastName = snapshot.val().lastName;
  }

  var dataSet = [firstName, lastName, snapshot.val().mobileNo, snapshot.val().userType, snapshot.val().isActive, snapshot.key];
  table.rows.add([dataSet]).draw();
});

$('#users tbody').on( 'click', 'button', function () {
  console.log("Button clicked");
  //get the row data
  var userId = table.row( $(this).parents('tr') ).data()[5];
  console.log("User is: "+ userId);

  // get clicked user data from database
  var data;
  firebase.database().ref('Users/' + userId).once('value',function(snapshot) {
    data = [snapshot.val().firstName, snapshot.val().lastName, snapshot.val().mobileNo, snapshot.val().userType, snapshot.val().isActive, snapshot.key];
  });

  var clickedClass = $(this).attr("class");
  console.log("Class is: " + clickedClass);
  console.log("Text is: " + $(this).text())

  if ( clickedClass.includes("userType")) {
    console.log("inside userType check");
    // toggle user type
    if (data[3] == "Sakhi") {
      console.log("Its a sakhi");
      // update in db
      firebase.database().ref('Users/' + data[5]).update({
        userType: "Client"
      });
      //update in UI
      $(this).text("CLIENT");
      $(this).removeClass("btn-primary").addClass("btn-default");
    } else if (data[3] == "Client") {
      console.log("Its a client");
      // update in db
      firebase.database().ref('Users/' + data[5]).update({
        userType: "Sakhi"
      });
      //update in UI
      $(this).text("SAKHI");
      $(this).removeClass("btn-default").addClass("btn-primary");
    }
    
  } else if ( clickedClass.includes("activeInactive")) {
    console.log("Inside activeInactive");
    // toggle active
    if (data[4] == "Y") {
      console.log("Its active");
      // update in db
      firebase.database().ref('Users/' + data[5]).update({
        isActive: "N"
      });
      //update in UI
      $(this).text("INACTIVE");
      $(this).removeClass("btn-success").addClass("btn-danger");
    } else if (data[4] == "N") {
      console.log("Its inactive");
      // update in db
      firebase.database().ref('Users/' + data[5]).update({
        isActive: "Y"
      });
      //update in UI
      $(this).text("ACTIVE");
      $(this).removeClass("btn-danger").addClass("btn-success");
    }
  }
});