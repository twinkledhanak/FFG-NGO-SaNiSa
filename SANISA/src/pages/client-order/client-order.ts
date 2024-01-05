import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import firebase from 'firebase';
import { ClientViewOrderStatusPage } from '../client-view-order-status/client-view-order-status';


@Component({
  selector: 'page-client-order',
  templateUrl: 'client-order.html',
})
export class ClientOrderPage {

  orders:Order[]=[];
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
      this.FireDatabase.list(`/Orders`).snapshotChanges().subscribe(data=>{
        data.forEach(item=>{
          var value = item.payload.val();
          if(this.currentUserId==value.placedBy)
          {
            this.orders.push(item.payload.val());
          }
        })
      })
    
  }
  viewOrder(order: any) {
  this.navCtrl.setRoot(ClientViewOrderStatusPage, {order : order} );
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
  }

}
