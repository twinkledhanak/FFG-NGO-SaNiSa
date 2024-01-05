import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { Product } from '../../models/product';
import { ViewProductPage } from '../view-product/view-product';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  products: Product[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private FireDatabase: AngularFireDatabase) {
    this.getDataFromFirebaseDatabase();
  }

  getDataFromFirebaseDatabase() {
    var productCount = 0;
    var isActive = 'Y';
    this.FireDatabase.list(`/Products`).snapshotChanges().subscribe(data => {
      data.forEach(item => {

        var value = item.payload.val();
        if (isActive == value.isActive) {
          this.products.push(value);
          this.products[productCount].key = item.key;
          productCount++;
        }
      })
    })
  }

  viewProduct(product: any) {
    this.navCtrl.setRoot(ViewProductPage, { product });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProductsPage');
  }

}
