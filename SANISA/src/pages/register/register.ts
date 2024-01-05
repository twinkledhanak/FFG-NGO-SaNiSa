import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';
import firebase from 'firebase';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Address } from '../../models/address';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',

})
export class RegisterPage {

  registerForm: FormGroup;
  user = {} as User;
  address = {} as Address;
  alertFlag: boolean = true;

  constructor(private builder: FormBuilder, private FireAuth: AngularFireAuth, private FireDatabase: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {

    this.registerForm = builder.group({
      'name': [
        '', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')])
      ],
      'phoneNumber': [
        '', Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)])
      ],
      'email': [
        '', Validators.compose([Validators.required])
      ],
      'password': [
        '', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('[a-zA-Z0-9]*')])
      ],
      'addressLine1': [
        '', Validators.compose([Validators.required])
      ],
      'city': [
        '', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z]*')])
      ],
      'pinCode': [
        '', Validators.compose([Validators.required, Validators.maxLength(6), Validators.minLength(6)])
      ]

    });
  }
  async register(user: User, password: string, address: Address) {
    if (this.validate()) {

      const info = await this.FireAuth.auth.createUserWithEmailAndPassword(user.email, password)

      var currentUserId = firebase.auth().currentUser.uid;
      console.log("Adding user data to: " + currentUserId);
      if (info) {
        user.userType = 'Client';
        address.default = true;
        firebase.database().ref('Users/' + currentUserId).set({
          username: user.name,
          email: user.email,
          userType: user.userType,
          mobileNo: user.phoneNumber,
        });

        firebase.database().ref('/Users/' + currentUserId + '/Addresses/').push(this.address);
        let alert = this.alertCtrl.create({
          subTitle: 'Registered Successfully!',
          buttons: ['OK']
        });
        alert.present(alert);

        this.navCtrl.setRoot(HomePage);
      }

    }

  }

  public validate(): boolean {

    if (this.registerForm.valid) {
      return true;
    }

    let errorMsg = '';

    let controlName = this.registerForm.controls['name'];
    if (!controlName.valid && this.alertFlag) {
      if (controlName.errors['required']) {
        this.alertFlag = false;
        errorMsg = 'Provide a username please';
      }
    }
    

    let controlPhoneNumber = this.registerForm.controls['phoneNumber'];
    if (!controlPhoneNumber.valid && this.alertFlag) {
      if (controlPhoneNumber.errors['required']) {
        errorMsg = 'Provide a phone number';
        this.alertFlag = false;
      } else if (controlPhoneNumber.errors['maxLength'] || controlPhoneNumber.errors['minLength']
        && this.alertFlag) {
        errorMsg = 'Please enter a valid phone number';
        this.alertFlag = false;
      }
    }

    let controlEmail = this.registerForm.controls['email'];
    if (!controlEmail.valid && this.alertFlag) {
      if (controlEmail.errors['required']) {
        errorMsg = 'Provide an email please';
        this.alertFlag = false;
      } else {
        errorMsg = 'Please provide a valid email';
      }
    }

    let controlPassword = this.registerForm.controls['password'];
    if (!controlPassword.valid && this.alertFlag) {
      if (controlPassword.errors['required']) {
        errorMsg = 'Provide a password please';
        this.alertFlag = false;
      } else {
        this.alertFlag = false;
        errorMsg = 'Password must have atleast one small character, one capital letter and one number';
      }
    }

    let controlAddress = this.registerForm.controls['addressLine1'];
    if (!controlAddress.valid && this.alertFlag) {
      if (controlAddress.errors['required']) {
        errorMsg = 'Provide a address please';
        this.alertFlag = false;
      } else {
        errorMsg = 'Please provide a valid address';
        this.alertFlag = false;
      }
    }

    let controlCity = this.registerForm.controls['city'];
    if (!controlCity.valid && this.alertFlag) {
      if (controlCity.errors['required']) {
        errorMsg = 'Provide a city please';
        this.alertFlag = false;
      } else {
        errorMsg = 'Please provide a valid city';
        this.alertFlag = false;
      }
    }

    let controlPincode = this.registerForm.controls['pinCode'];
    if (!controlPincode.valid && this.alertFlag) {
      if (controlPincode.errors['required']) {
        errorMsg = 'Provide a pincode please';
        this.alertFlag = false;
      } else {
        errorMsg = 'Please provide a valid pincode';
        this.alertFlag = false;
      }
    }

    let alert = this.alertCtrl.create({
      subTitle: errorMsg || 'Empty error message!',
      buttons: ['OK']
    });
    alert.present(alert);

    return false;
  }
}