import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../login/login";
import {RemoteProvider} from "../../providers/remote/remote";

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {
    public licence_details: any;
    public name: string;
    public licence_no: string;
    public national_id: string;
    public gender: string;
    public dob: string;
    public date_of_issue: string;
    public user_image:string;


    constructor(public navCtrl: NavController, private storage: Storage,private _remote: RemoteProvider) {
        this.ionViewDidLoad();

        this.storage.get('app_session').then((val) => {
            this.licence_details = val;
            this.name = this.licence_details.name;
            this.licence_no = this.licence_details.licence_no;
            this.national_id = this.licence_details.national_id;
            this.gender = this.licence_details.gender;
            this.dob = this.licence_details.dob;
            this.date_of_issue = this.licence_details.date_of_issue;
            this.user_image = this._remote.getAvatar(this.licence_details.image);

        });


    }

    ionViewDidLoad() {
        this.storage.get('user_id').then((val) => {

            if (val == null) {
                this.navCtrl.push(LoginPage);
            }
        });
    }


    logout(){
        this._remote.logout();
    }


}
