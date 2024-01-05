import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Product } from '../../models/product';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
/**
 * Generated class for the ViewProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-view-product',
  templateUrl: 'view-product.html',
})
export class ViewProductPage {

  data: { productID: "", productName: "", unitPrice: "", unitWeight: "", quantity: "" };

  product: any;
  private currentNumber = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SQLite, public toast: Toast) {
    this.product = navParams.get('product');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductPage');
  }

  private increment() {
    this.currentNumber++;

  }

  private decrement() {
    if (this.currentNumber > 1) {
      this.currentNumber--;
    }
  }

  addCart(productID, productName, productPrice, productWeight, quantity) {
    var totalCost = productPrice * quantity;
    console.log("Product ID in addCart: " + productID);
    console.log("Inside AddCart. ID: " + productID + " Name: " + productName + " Price: " + totalCost + " Weight: " + productWeight + " Quantity: " + quantity);
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS localCart(rowid INTEGER PRIMARY KEY, productID TEXT, productName TEXT, productPrice INT, productWeight INT, productQuantity INT,total INT)', {})
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('Select * from localCart where productID=?', [productID])
        .then(res => {
          if (res.rows.length > 0) {
            var totalQuantity = res.rows.item(0).productQuantity + quantity;
            var totalCostUpdate = res.rows.item(0).total + totalCost;
            db.executeSql('Update localCart set productQuantity=?, total=? where productID=?', [totalQuantity, totalCostUpdate, productID])
              .then(res => {
                console.log("Run UPDATE query. Cost: " + totalCostUpdate + " Quantity: " + totalQuantity)
                this.toast.show("Product Added", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  }
                )
              }).catch(e => console.log(e));

          }
          else {
            console.log("Run INSERT query");
            db.executeSql('INSERT INTO localCart VALUES(NULL,?,?,?,?,?,?)', [productID, productName, productPrice, productWeight, quantity, totalCost])
              .then(res => {
                this.toast.show("Product Added", '5000', 'center').subscribe(
                  toast => {
                    console.log(toast);
                  }
                )
                console.log(res);
              })
          }

        }).catch(e => console.log(e));


    })
      .catch(e => console.log(e));
  }
}
