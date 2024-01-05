import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { CartPage } from '../pages/cart/cart';
import { OrdersPage } from '../pages/orders/orders';
import { ReferPage } from '../pages/refer/refer';
import { OffersPage } from '../pages/offers/offers';
import { FeedbackPage } from '../pages/feedback/feedback';
import { MyInventoryPage } from '../pages/my-inventory/my-inventory';
import { AdhocOrderPage } from '../pages/adhoc-order/adhoc-order';
import { ReimbursementsPage } from '../pages/reimbursements/reimbursements';
import { MySakhiOrdersPage } from '../pages/my-sakhi-orders/my-sakhi-orders';
import { ClientOrderPage } from '../pages/client-order/client-order';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  userType: any;
  pages: Array<{title: string, component: any}>;

  constructor(private FireAuth: AngularFireAuth, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.FireAuth.authState.subscribe(auth => {this.pages = [];this.updateNavItems()});
}

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  updateNavItems(){
    this.pages = [];
    this.pages = [{ title: 'Browse', component: HomePage }];
    // if no user is logged in then add login page
    var currentUser = firebase.auth().currentUser;
    var currentUserId: any;
    if(currentUser == null) {
      console.log("No user is logged in");
      this.pages.push({ title: 'Login', component: LoginPage });
    } else {
      console.log("User is logged in");
      currentUserId = firebase.auth().currentUser.uid;
      console.log(currentUser);
      //if user is logged in add profile,cart,order,feedback page
      this.pages.push({ title: 'My profile', component: ProfilePage },
                      { title: 'My cart', component: CartPage },
                      { title: 'My orders', component: ClientOrderPage });

      //if user is logged in and is a sakhi
      firebase.database().ref('Users').child(currentUserId).once('value', (snapshot) => {
        console.log(snapshot.val());
        if(snapshot != null){
         this.userType = snapshot.val().userType;
        }

        if(this.userType == "Sakhi"){
          console.log('is a sakhi');
          this.pages.push({ title: 'My inventory', component: MyInventoryPage },
            { title: 'Adhoc order', component: AdhocOrderPage },
            { title: 'Reimbursements', component: ReimbursementsPage },
            { title: 'My sakhi orders', component: MySakhiOrdersPage }
          ); 
        } else {
          console.log(this.userType);
        }
      });
      
      // update list when cline <-> sakhi happens
      firebase.database().ref('user').child(currentUserId).on('child_changed', snap => {
        this.pages = [];
        this.updateNavItems();
      });
    
    }                  
    this.pages.push({ title: 'Refer a friend', component: ReferPage },
                    { title: 'Offers', component: OffersPage },
                    { title: 'Feedback', component: FeedbackPage });
}
}
