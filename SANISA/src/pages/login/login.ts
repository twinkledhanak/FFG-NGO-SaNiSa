import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import { User } from '../../models/user';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home'
import * as firebase from 'firebase'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  constructor(private loadingCtrl: LoadingController,private alertCtrl: AlertController, private FireAuth: AngularFireAuth,public navCtrl: NavController, 
    public navParams: NavParams) {
      this.checkIfUserIsAlreadyLoggedIn();
  }

  checkIfUserIsAlreadyLoggedIn(){
    var currentUser = firebase.auth().currentUser;
       if(currentUser != null) {
        console.log("current user: " + currentUser.uid);
        console.log(currentUser);
        this.navCtrl.setRoot(HomePage);
        } else {
        }
   }
  async login(user : User, password : string) {
    try {
        const info = await this.FireAuth.auth.signInWithEmailAndPassword(user.email, password);
        if(info) {
          await this.navCtrl.setRoot(HomePage);
        }
    }
    catch(exception){
      console.error(exception); 
    }
  }

  register(){
    this.navCtrl.push(RegisterPage);
  }

  showForgotPassword(){


    
    let prompt = this.alertCtrl.create({
      title: 'Enter your email',
      message: "A new password will be sent to you",
      inputs:[{
        name: 'recoverEmail',
        placeholder: 'you@example.com'
      },
    ],
    buttons: [{
      text: 'Cancel',
      handler: data => {
        console.log('Cancel Clicked');
      }
    },
    {
      text: 'Submit',
      handler: data => {

        //add preloader
        let loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
          content: 'Resetting your password'

        });
        loading.present();
        this.forgotPasswordUser(data.recoverEmail, loading).then(()=>{
        
        loading.dismiss().then(()=> {

          let alert =this.alertCtrl.create({
            title: 'Email sent successfully',
            subTitle: "Please check your email",
            buttons:  ['OK']
          });
          alert.present();


        }
        ,error => {
          loading.dismiss().then(()=> {
          let alert =this.alertCtrl.create({
            title: 'Error resetting password user not registered',
            subTitle: "Please register!",
            buttons:  ['OK']
          });
          alert.present();
        })

        }
      );

        });
      }
    }
  ]
    });
    prompt.present();
  }

  forgotPasswordUser(email: any, loading){
    
    return this.FireAuth.auth.sendPasswordResetEmail(email)
        .catch( err => {
        loading.dismiss();
        this.navCtrl.push(RegisterPage);
        
    });
}
}
