/**
This file manages the login to the admin panel.
**/
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

$(function () {
    $('#sign_in').validate({
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        }
    });
});

// when the user clicks on login button
$("#btn_login").on('click', function(){
  var email = $("#username").val().concat("@sanisa.co.in");
  var password = $("#password").val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    alert('Some error occured. Contact technical support. Message: '+ errorMessage);
  }).then(function(){
    window.location = "../index.html";
  });
});