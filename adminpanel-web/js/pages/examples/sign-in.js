$(function () {
    $('#sign_in').validate({
        highlight: function (input) {
            console.log(input);
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

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAao7jbNPF5doQjTRK1xcngVU3RLyEhvWY",
  authDomain: "test-1-90e5c.firebaseapp.com",
  databaseURL: "https://test-1-90e5c.firebaseio.com",
  projectId: "test-1-90e5c",
  storageBucket: "test-1-90e5c.appspot.com",
  messagingSenderId: "142293669718"
};
firebase.initializeApp(config);

// =========================AUTHENTICATION CODE===========================================================================

//get the elements
const username = document.getElementById('username');
const password = document.getElementById('password');
const btn_login = document.getElementById('btn_login');
const btn_signup = document.getElementById('btn_signup');
const forgot = document.getElementById('forgot');

//initialise firebase auth
auth = firebase.auth()

//add signup code

btn_login.addEventListener('click', function(e){
  //add login code
  const promise_login = auth.signInWithEmailAndPassword(username.value, password.value);
  promise_login.then(function(){
    console.log(auth.currentUser.uid);
  })
  .catch(function(error){
    console.log(error);
  });
})

forgot.addEventListener('click', function(e){
  auth.signOut();
});
auth.onAuthStateChanged(function(user){
  console.log(user);
});
