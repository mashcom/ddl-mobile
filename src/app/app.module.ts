import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {SignupPage} from "../pages/signup/signup";

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Camera} from "@ionic-native/camera";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {HttpClientModule} from "@angular/common/http";
import {RemoteProvider} from '../providers/remote/remote';
import {LoginPage} from "../pages/login/login";
import {IonicStorageModule} from "@ionic/storage";


@NgModule({
    declarations: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        LoginPage,
        SignupPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        AboutPage,
        ContactPage,
        HomePage,
        TabsPage,
        LoginPage,
        SignupPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        BarcodeScanner,

        {provide: ErrorHandler, useClass: IonicErrorHandler},
        RemoteProvider
    ]
})
export class AppModule {
}
