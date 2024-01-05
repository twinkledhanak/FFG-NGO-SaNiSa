import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Order } from '../../models/order';
import { AngularFireDatabase } from 'angularfire2/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as firebase from 'firebase';

/**
 * Generated class for the PlaceOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-place-order',
  templateUrl: 'place-order.html',
})
export class PlaceOrderPage {

  order ={} as Order;
  userId:string;
  productsForOrder: any[] = [];
  products : any[]=[];
  productsMap : Map<string,{}> = new Map();
  placedByUser : string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private fireBaseDb: AngularFireDatabase,
    public alertCtrl :AlertController,public sqlite : SQLite) {
    
    this.userId = firebase.auth().currentUser.uid;
    this.getUserName();
    this.getProductsFromLocalCart();
  }

  getProductsFromLocalCart(){

    var orderAmount:number;
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => { 
      db.executeSql('SELECT * FROM localCart ORDER BY rowid DESC', {})
      .then(res =>{
        
        for(var i=0; i<res.rows.length; i++) {
          
          var productId = res.rows.item(i).productID
          var productName = ""
          
          firebase.database().ref(`Products/${productId}`).once('value', (snapshot) => {
            console.log(snapshot)
            productName = snapshot.val().productName
          });
        
          var product ={"unitPrice":res.rows.item(i).productPrice,"unitQuantity":res.rows.item(i).productQuantity,"productName":productName}; 
          this.products.push(product);

          var productForDb = {"unitPrice":res.rows.item(i).productPrice,"unitQuantity":res.rows.item(i).productQuantity}

          this.productsMap[productId] = productForDb
          
          
        }
         
      });
  })
  this.createOrder(this.products,orderAmount);
  }

  getUserName(){
    firebase.database().ref(`Users/${this.userId}`).once('value', (snapshot) => {
      this.placedByUser = snapshot.val().name;
      console.log(this.placedByUser)
    });
  }

  createOrder(products,totalCartAmount){

    let currentTimeStamp = new Date();
    var orderId = this.generateOrderId(currentTimeStamp);

    var deliveryAddress = this.navParams.get("deliveryAddress");

    this.order={
      "Comments":"Not an Adhoc Order",
      "MatchedSakhis" : [{}],
      "Products": this.productsMap,
      "deliveryAddress":deliveryAddress,
      "isAdhocOrder" : "N",
      "getLastModifiedOn":currentTimeStamp.toString(),
      "lastModifiedBy" : this.userId,
      "orderId": orderId,
      "orderStatus": "Not Accepted",
      "orderType":"O",
      "placedBy":this.userId,
      "placedOn":currentTimeStamp.toString(),
      "sellerId":" ",
      "sellerStatus":" ",
      "totalAmount":this.navParams.get('totalAmount')
    }

  }

  generateOrderId(currentTimeStamp:Date){

    var date = currentTimeStamp.toLocaleDateString();
    date = date.split("/").join("");

    var time = currentTimeStamp.toLocaleTimeString();
    time = time.split(":").join("");

    return date+time;
  }

  placeOrder(){
    var key = this.fireBaseDb.list('/Orders/').push(this.order).key;
    let alert = this.alertCtrl.create({
      subTitle : "Your order has been placed with order Id:" + this.order.orderId,
      buttons:[{text : "Browse More Products",
                handler : data => {
                  this.navCtrl.push(HomePage);
                }
    },
    ]
    });
    alert.present();
   
  }


}
