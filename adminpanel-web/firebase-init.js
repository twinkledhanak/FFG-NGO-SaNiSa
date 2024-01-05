// Initialize Firebase
var config = {
  apiKey: "AIzaSyDE7UsfnGAJMFXffFj0wx9thOk5jrdyWsY",

  authDomain: "sanisa-in.firebaseapp.com",
  databaseURL: "https://sanisa-in.firebaseio.com",
  projectId: "sanisa-in",
  storageBucket: "sanisa-in.appspot.com",
  messagingSenderId: "430075285218"

};
firebase.initializeApp(config);

//check if user is in session. If yes then update details in view
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    // updating user details
    loggedInUserUID = firebase.auth().currentUser.uid;
    // read data from firebase database
    firebase.database().ref('Users/' + loggedInUserUID).once('value',function(snapshot) {
      $('#phone_no').text(snapshot.val().mobileNo);
      $('#full_name').text(snapshot.val().username);
    });
  } else {
    // No user is signed in. So divert to login page
    window.location = "../login/index.html";
  }
});

$("#btn_signout").on('click', function(e){
  firebase.auth().signOut();
});