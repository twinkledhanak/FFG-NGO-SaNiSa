import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home'


@Component({
  selector: 'page-my-inventory',
  templateUrl: 'my-inventory.html',
})
export class MyInventoryPage {

  products: any;
  currentUser: any;
  
  constructor(private FireAuth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,
  private FireDatabase: AngularFireDatabase) {
    this.checkIfUserIsAlreadyLoggedIn();
    this.getDataFromFirebaseDatabase();
  }

  checkIfUserIsAlreadyLoggedIn(){
    this.currentUser = firebase.auth().currentUser.uid;
       if(this.currentUser == null) {
        this.navCtrl.setRoot(HomePage);
        } else {
          console.log(this.currentUser);
        }
   }

   getDataFromFirebaseDatabase(){
    this.FireDatabase.list('Inventory/'+ this.currentUser).valueChanges().subscribe(
      response => 
      {
        this.products = response
        // for each product add a productName after fetching it from Products branch
        this.products.forEach(element => {
         for (var key in element){
           element.unitQuantity = element[key];
           element.unitWeight = element[key] * 200/1000;
           firebase.database().ref('Products/'+key).once('value', (snapshot) => {
             element.productName = snapshot.val().productName
           });
         }
        });
      }
     )
 }

  viewProduct(product: any) {
    this.navCtrl.setRoot('ViewProductPage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductsPage');
  }

}
