import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {HomePage} from "../home/home";
import {TabsPage} from "../tabs/tabs";
import {SignupPage} from "../signup/signup";
import {RemoteProvider} from "../../providers/remote/remote";
import {Storage} from '@ionic/storage';
import { ModalController } from 'ionic-angular';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    licence_no: string;
    password: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private _remoteProvider: RemoteProvider, private loadingCtrl: LoadingController,
                public storage: Storage,public modalCtrl: ModalController) {
        this.storage.get('user_id').then((val) => {
            if (val != null) {
                this.navCtrl.push(TabsPage);
            }
        });
    }

    ionViewDidLoad() {
        this.storage.get('user_id').then((val) => {
            if (val != null) {
                this.navCtrl.push(TabsPage);
            }
        });
        console.log('ionViewDidLoad LoginPage');
    }

    showSignupPage(){
      let modal = this.modalCtrl.create(SignupPage);
      modal.present();


    }
    login() {

        if(this.licence_no ==null || this.password==null){
            this._remoteProvider.presentToast("Licence Number & Password are required");
            return;
        }
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();

        this._remoteProvider.login(this.licence_no, this.password).subscribe((data) => {
            console.log(JSON.stringify(data));
            // console.log(data.licence_no);
            console.log("Final Result");


            if (data['licence_no'] !== undefined) {
                this.storage.set('app_session',data);
                this.storage.set('user_licence_no', data['licence_no']);
                this.storage.set('user_name', data['name']);
                this.storage.set('user_national_id', data['national_id']);
                this.storage.set('user_dob', data['dob']);
                this.storage.set('user_date_of_issue', data['date_of_issue']);
                this.storage.set('gender', data['gender']);
                this.storage.set('user_image', data['image']);
                this.storage.set('user_id', data['id']);

                this._remoteProvider.presentToast("Login Successful");
                this.navCtrl.push(TabsPage);
                return;
            }
            else {
                this._remoteProvider.presentToast("Login Failed");
            }

        }, (error) => {
            this._remoteProvider.presentToast("Network Error");
            console.log(JSON.stringify(error));
        });
        loader.dismiss();

    }

}
