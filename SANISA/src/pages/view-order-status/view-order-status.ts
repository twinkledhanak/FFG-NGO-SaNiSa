import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DisplayOrder } from '../../models/displayorder';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the ViewOrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-view-order-status',
  templateUrl: 'view-order-status.html',
})
export class ViewOrderStatusPage {
 
  order: DisplayOrder ;
  constructor(public navCtrl: NavController, public navParams: NavParams,public atrCtrl: AlertController) {
    this.order = navParams.get('order');
    console.log(this.order.Key);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOrderStatusPage');
  }

  changeStatus(Key : string) {

    let alert = this.atrCtrl.create();
    alert.setTitle('Update Status');

    alert.addInput({
      type: 'radio',
      label: 'Pending',
      value: 'Pending',
      checked: true
    });
    alert.addInput({
      type: 'radio',
      label: 'Out For Delivery',
      value: 'Out For Delivery',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Delivered',
      value: 'Delivered',
      checked: false
    });
    alert.addButton({
      text: 'Cancel',
      handler: data=>{
        console.log("Cancel clicked");
      }
    });
    alert.addButton({
      text: 'OK',
      handler: data=>{
        console.log("OK clicked");
        console.log(data);
        firebase.database().ref('Orders/' + Key).update({
        orderStatus : data

      });
    this.navCtrl.setRoot(ViewOrderStatusPage, {order : DisplayOrder});
    }
    });
    alert.present();
  }
}
