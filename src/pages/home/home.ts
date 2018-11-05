import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController, ToastController} from 'ionic-angular';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {HttpClient} from "@angular/common/http";
import {RemoteProvider} from "../../providers/remote/remote";
import {Storage} from "@ionic/storage";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../login/login";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public req_id = [];

    constructor(public navCtrl: NavController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private barcodeScanner: BarcodeScanner, private http: HttpClient, private _remote: RemoteProvider,
                public storage: Storage) {

        this.ionViewDidLoad();

    }

    ionViewDidLoad() {
        this.storage.get('user_id').then((val) => {
            if (val == null) {
                this.navCtrl.push(LoginPage);
            }
        });
    }


    scan() {

        this.showCamera();
         this.barcodeScanner.scan().then(barcodeData => {
             console.log('Barcode data', barcodeData);
             console.log(JSON.stringify(barcodeData));
             let qr_token = barcodeData.text;

             if(qr_token ==''){
                 this.navCtrl.push(HomePage);
                 return;
             }
             let confirm = this.alertCtrl.create({
                 title: 'Synchronise Data?',
                 message: 'Do you agree to allow law enforcement agent system to check your record?',
                 buttons: [
                     {
                         text: 'Disagree',
                         handler: () => {
                             console.log('Disagree clicked');
                         }
                     },
                     {
                         text: 'Agree',
                         handler: () => {
                             console.log('Make remote request');
                             this.storage.get('user_id').then((val) => {
                                 this.makeRequest(val,qr_token);
                             });

                         }
                     }
                 ]
             });
             confirm.present();
         }).catch(err => {
             console.log('Error', err);
         });

    }

    presentToast(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }

    makeRequest(payload: any,qr_token:string) {

        console.log("Final Result");
        const loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
        loader.present();
        this._remote.updateRemote(payload,qr_token).subscribe((data) => {
            loader.dismiss();
            console.log('response');
            console.log(data);
            if (data['status'] == "access_denied") {
                this.presentToast("Error Invalid QR Validation");
            }
            else if (data['status'] == "success") {
                this.presentToast("Your information was send successfully");
            } else {
                this.presentToast("Unknown response from authentication server");
            }
        }, (error) => {
            console.log("ERROR HTTP");
            console.log(JSON.stringify(error));
            this.presentToast("Error Invalid QR Validation");
            loader.dismiss();
        });

        console.log(this.req_id);

    }

    ionViewWillLeave() {
        this.hideCamera();
    }

    showConfirm() {
        let confirm = this.alertCtrl.create({
            title: 'User Agreement?',
            message: 'Do you agree to allow law enforcement agent to access your details?',
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        this.scan();
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    }

    showCamera() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    }

    hideCamera() {
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    }

    logout(){
        this._remote.logout();
    }


}
