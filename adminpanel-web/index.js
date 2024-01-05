// Initialize Firebase
var config = {
  apiKey: "AIzaSyC6PO8XqyoA5qHk_RkRw8cys_T12N-lMlc",
  authDomain: "ffg-sanisa.firebaseapp.com",
  databaseURL: "https://ffg-sanisa.firebaseio.com/",
  projectId: "ffg-sanisa",
  storageBucket: "ffg-sanisa.appspot.com",
  messagingSenderId: "142293669718"
};
firebase.initializeApp(config);

//check if user is in session
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.

    //updating user details
    loggedInUserUID = firebase.auth().currentUser.uid;
    // read data from firebase database
    firebase.database().ref('Users/' + loggedInUserUID).once('value',function(snapshot) {
      $('#phone_no').text(snapshot.val().mobileNo);
      $('#full_name').text(snapshot.val().firstName + ' ' + snapshot.val().lastName);
    });
    
  } else {
    // No user is signed in.
    window.location = "login/index.html";
  }
});

$("#btn_signout").on('click', function(e){
  firebase.auth().signOut();
});