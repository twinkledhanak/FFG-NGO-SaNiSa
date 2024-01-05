import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {Toast } from '@ionic-native/toast';

import { MyApp } from './app.component';
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
import { SelectAddressPage } from '../pages/select-address/select-address';
import { PlaceOrderPage } from '../pages/place-order/place-order';
import { ViewProductPage } from '../pages/view-product/view-product';
import { ViewOrderStatusPage } from '../pages/view-order-status/view-order-status';
import { RegisterPage } from '../pages/register/register';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_INFO } from './firebase.info'; 
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { Toast } from '@ionic-native/toast';
import { ClientOrderPage } from '../pages/client-order/client-order';
import { ClientViewOrderStatusPage } from '../pages/client-view-order-status/client-view-order-status';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage, ProfilePage, CartPage, OrdersPage,ReferPage, OffersPage, RegisterPage,
    FeedbackPage, MyInventoryPage, AdhocOrderPage, ReimbursementsPage, MySakhiOrdersPage, PlaceOrderPage,
    SelectAddressPage, ViewProductPage, ViewOrderStatusPage, ClientOrderPage,ClientViewOrderStatusPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(FIREBASE_INFO),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage, ProfilePage, CartPage, OrdersPage,ReferPage, OffersPage, RegisterPage,
    FeedbackPage, MyInventoryPage, AdhocOrderPage, ReimbursementsPage, MySakhiOrdersPage, SelectAddressPage,
    PlaceOrderPage, ViewProductPage, ViewOrderStatusPage, ClientOrderPage,ClientViewOrderStatusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    Toast
  ]
})
export class AppModule {}
