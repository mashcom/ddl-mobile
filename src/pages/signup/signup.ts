import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {RemoteProvider} from "../../providers/remote/remote";
import {LoginPage} from "../login/login";

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})
export class SignupPage {

    public licence_no: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private _remoteProvider: RemoteProvider, private loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
    }


    checkAccount() {
        if (this.licence_no == null) {
            this._remoteProvider.presentToast("Licence Number is required");
            return;
        }
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();

        this._remoteProvider.checkAccount(this.licence_no).subscribe((data) => {

            console.log("Account Check Result");
            console.log(JSON.stringify(data));
            if (data["status"] == "success") {

                let alert = this.alertCtrl.create({
                    title: 'Success!',
                    subTitle: 'A 4 digit token was sent to your email ' + data['email'],
                    inputs: [
                        {
                            name: 'token',
                            placeholder: 'Enter the token here!'
                        },
                    ],
                    buttons: [
                        {
                            text: "Ok",
                            handler: (data) => {
                                this.checktoken(data.token);
                            }
                        }
                    ]
                });
                alert.present();
                loader.dismiss();
            }

        }, (error) => {
            loader.dismiss();
            this._remoteProvider.presentToast("No email found for this licence number");
            console.log(JSON.stringify(error));
        });

    }

    checktoken(token: number) {
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();

        this._remoteProvider.checkToken(this.licence_no, token).subscribe((data) => {
            loader.dismiss();
            console.log("Account Check Result");
            console.log(JSON.stringify(data));
            if (data["status"] == "success") {
                let alert = this.alertCtrl.create({
                    title: 'Token Valid',
                    subTitle: 'Enter your password!',
                    inputs: [
                        {
                            name: 'password',
                            placeholder: 'Enter password!',
                            type:'password'
                        },
                        {
                            name: 'confirm_password',
                            placeholder: 'Enter confirm password!',
                            type:'password'
                        }
                    ],
                    buttons: [
                        {
                            text: "Save Password",
                            handler: (data) => {
                                this.createPassword(data.password, data.confirm_password);
                            }
                        }
                    ]
                });
                alert.present();
            } else {
                this._remoteProvider.presentToast("Invalid token, Try again!");
            }

        }, (error) => {
            loader.dismiss();
            this._remoteProvider.presentToast("Invalid token, Try again!");
            console.log(JSON.stringify(error));
        });

    }


    createPassword(password: string, confirm_password: string) {
        if (password != confirm_password) {
            this._remoteProvider.presentToast("Password do not match!");
            return;
        }
        if (password.length < 4) {
            this._remoteProvider.presentToast("Password should be at least 4 characters!");
            return;
        }
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();

        this._remoteProvider.savePassword(this.licence_no, password).subscribe((data) => {
            loader.dismiss();
            console.log("Account Check Result");
            console.log(JSON.stringify(data));
            if (data["status"] == "success") {
                let alert = this.alertCtrl.create({
                    title: 'Password Reset successful',
                    subTitle: '',
                    buttons: [{
                        text: "ok",
                        handler: () => {
                            this.navCtrl.push(LoginPage);
                        }
                    }]
                });
                alert.present();
            } else {
                this._remoteProvider.presentToast("Error saving password!");
            }

        }, (error) => {
            loader.dismiss();
            this._remoteProvider.presentToast("Error saving password!");
            console.log(JSON.stringify(error));
        });
    }


}
