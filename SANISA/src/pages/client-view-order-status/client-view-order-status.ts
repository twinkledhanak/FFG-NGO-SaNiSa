import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Order } from '../../models/order';
import { AngularFireDatabase } from 'angularfire2/database';


@Component({
  selector: 'page-client-view-order-status',
  templateUrl: 'client-view-order-status.html',
})
export class ClientViewOrderStatusPage {


  order: Order ;
  productsArray:any[] = [];
  progressImgY: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public atrCtrl: AlertController,private FirebaseDb:AngularFireDatabase) {
    this.order = navParams.get('order');
    // var barstats = 0;
    // if(this.order.orderStatus=="Not Accepted")
    // {
    //   barstats = 1;
    // }
    // else 
    //   if (this.order.orderStatus=="Accepted") {
    //     barstats = 2;
    //   }else 
    //     if (this.order.orderStatus=="Out For Delivery") {
    //       barstats = 3;
    //     }else
    //        if (this.order.orderStatus=="Delivered"){
    //         barstats = 4;
    // } 

    this.progressImgY = "https://firebasestorage.googleapis.com/v0/b/sanisa-in.appspot.com/o/Images%2Fprogress_bar.jpg?alt=media&token=2776482d-d2ee-44cc-9825-e0111998ad2c";
    var products = this.order.Products;
    for(var key in products){
     var productFromMap = products[key]
     var product = {"productName":" ","unitPrice":productFromMap.unitPrice,"unitQuantity":productFromMap.unitQuantity}
     this.FirebaseDb.list(`/Products/`).snapshotChanges().subscribe(data=>{
       data.forEach(item=>{
         if(item.key===key){
            product.productName = item.payload.val().productName;
         }
       })

     })
     this.productsArray.push(product)
    }
    console.log(this.productsArray)

  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClientViewOrderStatusPage');
  }

}
