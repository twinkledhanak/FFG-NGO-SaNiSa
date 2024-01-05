import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SelectAddressPage } from '../select-address/select-address';
import { Order } from '../../models/order';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  orders:any=[];
  total=0;

  constructor(public navCtrl: NavController, public navParams: NavParams,private sqlite: SQLite) {
    this.getData();
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      db.executeSql('SELECT * FROM localCart ORDER BY rowid DESC', {})
      .then(res => {
        this.orders = [];
      
        for(var i=0; i<res.rows.length; i++) {
          console.log(res.rows.item(i).rowid+" "+res.rows.item(i).productID+" "+res.rows.item(i).total+" "+res.rows.item(i).productWeight+" "+res.rows.item(i).productQuantity);
          this.orders.push({rowid:res.rows.item(i).rowid,productID:res.rows.item(i).productID,productName:res.rows.item(i).productName,productPrice:res.rows.item(i).total,productWeight:res.rows.item(i).productWeight,quantity:res.rows.item(i).productQuantity})
         }
        
      })
      .catch(e => console.log(e));
      db.executeSql('SELECT SUM(total) AS total FROM localCart', {})
      .then(res => {
        if(res.rows.length>0) {
          this.total = parseInt(res.rows.item(0).total);
          console.log("total is "+this.total);
        }
        if (isNaN(this.total)){
          this.total=0;
        }
       
      }).catch(e=>console.log(e));
      
      
    }).catch(e => console.log(e));
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
  }
  selectAddress(){

    this.navCtrl.push(SelectAddressPage,{
      total : this.total
    });
  }

  deleteData(rowid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM localCart WHERE rowid=?', [rowid])
      .then(res => {
        console.log(res);
        this.getData();
      })
      .catch(e => console.log(e));
      
    }).catch(e => console.log(e));
  }

}
