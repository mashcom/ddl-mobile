import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {IRemote} from "./IRemote";
import {AlertController, LoadingController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";

/*
  Generated class for the RemoteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RemoteProvider {
    const
    ENDPOINT = "http://192.168.43.36/licence/backend/public/";

    constructor(public http: HttpClient, public toastCtrl: ToastController,
                public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage) {
        console.log('Hello RemoteProvider Provider');
    }

    getAvatar(image_name) {
        return this.ENDPOINT + "images/" + image_name;
    }

    updateRemote(payload: any, qr_token: string): Observable<IRemote[]> {
        console.log(payload);
        return this.http.get<IRemote[]>(this.ENDPOINT + 'notify/' + payload + '/' + qr_token);
    }


    checkAccount(licence: string) {
        return this.http.get<IRemote>(this.ENDPOINT + '/reset/pwd/' + licence);
    }

    checkToken(licence_no: string, token: number) {
        return this.http.get<IRemote[]>(this.ENDPOINT + '/verify/token/' + licence_no + "/" + token);
    }

    savePassword(licence_no: string, password: string) {
        return this.http.get<IRemote[]>(this.ENDPOINT + '/save/password/' + licence_no + "/" + password);
    }

    login(licence_no, password) {
        console.log(licence_no);
        console.log(password);

        return this.http.get<IRemote[]>(this.ENDPOINT + 'api/auth/' + licence_no + "/" + password);
    }

    presentToast(message) {
        const toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    }

    logout() {
        let confirm = this.alertCtrl.create({
            title: 'Logout?',
            message: 'You are about to exit the app. Do you want to continue?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes,Logout',
                    handler: () => {
                        confirm.present();
                        this.storage.set('user_id', null).then(() => {
                                this.storage.get('user_id').then((val) => {
                                    if (val == null) {

                                        location.href = 'index.html';
                                    }
                                });
                            }
                        )


                    }
                }
            ]
        });
        confirm.present();

    }


}
