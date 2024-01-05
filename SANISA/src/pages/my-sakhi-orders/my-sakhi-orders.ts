import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { ViewOrderStatusPage } from '../view-order-status/view-order-status';
import firebase from 'firebase';
import { DisplayOrder } from '../../models/displayorder';

@Component({
  selector: 'page-my-sakhi-orders',
  templateUrl: 'my-sakhi-orders.html',
})
export class MySakhiOrdersPage {

  orders:DisplayOrder[]=[];
  currentUserId: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  private FireDatabase: AngularFireDatabase) {
    this.getDataFromFirebaseDatabase();
  }

  getDataFromFirebaseDatabase(){
    /* this.FireDatabase.list('order').valueChanges().subscribe(
       response => 
       {
         this.orders = response
       }
      )*/
      this.currentUserId = firebase.auth().currentUser.uid;
      var pointer = 0;
      this.FireDatabase.list(`/Orders`).snapshotChanges().subscribe(data=>{
        data.forEach(item=>{
          
          var value = item.payload.val();
          if(this.currentUserId==value.sellerId)
          {
            console.log(item.payload.val());
            this.orders.push(item.payload.val());
            this.orders[pointer].Key = item.key;
            console.log(item.key);
          }

          pointer++;
        })
      })
    
  }
  viewOrder(order: any) {
  
  this.navCtrl.setRoot(ViewOrderStatusPage, {order : order} );
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MySakhiOrdersPage');
  }
}
