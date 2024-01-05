import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Address } from '../../models/address'
import { HomePage } from '../home/home';
import { AngularFireDatabase } from 'angularfire2/database';
import { PlaceOrderPage } from '../place-order/place-order';
import * as firebase from 'firebase';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Order } from '../../models/order';
import { Toast } from '@ionic-native/toast';
import {AngularFireList } from 'angularfire2/database'

/**
 * Generated class for the SelectAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-select-address',
  templateUrl: 'select-address.html',
})
export class SelectAddressPage {

  addresses : string[] = [];
  addressKeys : string[] = [];
  enterNewAddress : boolean = false;
  selectedExistingAddress :string;
  newAddress = {} as Address;
  userId: string;
  deliveryAddress:string;
  defaultAddressFlag:boolean = true;
  addressObjectsArray : Address[] = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private firebaseDb:AngularFireDatabase,private toast:Toast) {

    this.userId = firebase.auth().currentUser.uid;
    this.getAddressList(this.userId);  
    
}

getAddressList(userId){
  this.firebaseDb.list(`/Users/${userId}/Addresses/`).snapshotChanges().subscribe(data=>{
    data.forEach(item=>{
      var addressObject = item.payload.val();

      var address = addressObject.addressLine1+" "+addressObject.city+" "+addressObject.pinCode;
      this.addresses.push(address);
      this.addressKeys.push(item.key);
      
      this.addressObjectsArray.push(addressObject);
      
    })   
})
}

textInputBoxGen(enterNewAddress:boolean){
  this.enterNewAddress = enterNewAddress;
}

changeDefaultFlags(){
  
  for(var i=0;i<this.addressKeys.length;i++){
    console.log(this.addressKeys[i])
    var key = this.addressKeys[i]
    var firebaseObject = this.firebaseDb.object(`Users/${this.userId}/Addresses/`+key);
    firebaseObject.update({default:false});
  }
  
}

toggleDefaultFlag(){
  this.defaultAddressFlag = !this.defaultAddressFlag;
}

confirmAddress(){

  if(this.enterNewAddress) {

    if(this.defaultAddressFlag){
      this.newAddress.default = true;
      this.changeDefaultFlags();
    }
    else{
      this.newAddress.default = false
    }

    if(Object.keys(this.newAddress).length !==0){
        this.firebaseDb.list(`/Users/${this.userId}/Addresses`).push(this.newAddress);
        this.deliveryAddress = this.newAddress.addressLine1+" "+this.newAddress.city+" "+this.newAddress.pinCode;
    
      }

    else{
      this.toast.show("Please Enter Address","short","bottom").subscribe(
        toast => {
          console.log(toast);
        });
    }
  }
  
  
  else{
    this.deliveryAddress = this.selectedExistingAddress;
  }
  if(this.deliveryAddress.length){
    
    this.navCtrl.push(PlaceOrderPage,{
      deliveryAddress : this.deliveryAddress,
      totalAmount : this.navParams.get('total')
    });
  }



}
}
