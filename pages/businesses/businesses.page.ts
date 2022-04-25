import { Component, NgZone } from "@angular/core";
import { NavController, ToastController } from "@ionic/angular";
import { Business } from "app/p_csr/models/business";
import { BusinessService } from "app/p_csr/services/business.service";
import { GeocodingService } from "app/gc_basic/services/geocoding.service";
import { LocationService } from "app/gc_basic/services/location.service";


@Component({
    selector: "businesses",
    templateUrl: "businesses.page.html",
    styleUrls: ["businesses.page.scss"]
})
export class BusinessesPage {


    businesses: Business[]
    loading: boolean;
    positioning: boolean;
    locationName: string;
    coordinates: number[];
    searchString:string
    constructor(
        private toastCtrl: ToastController,
        private businessService: BusinessService,
        private locationService: LocationService,
        private zone: NgZone,
        private navCtrl:NavController,
        private geocoding: GeocodingService,
    ) { }
    ngOnInit() {
        this.getBusinesses(null, false)
    }
    async getBusinesses(event, useOffset: boolean) {

        if (this.loading) return;
        this.loading = true

        try {

            let params = "?"
            if (!this.coordinates)
                this.coordinates = await this.getPosition()
            if (this.coordinates)
                params += "lat=" + this.coordinates[1] + "&lng=" + this.coordinates[0];

            let businesses = await this.businessService
                .getBusinesses(useOffset ? this.businesses.length : 0, params).toPromise()
            console.log("getBusinesses",businesses);
            this.businesses = useOffset ? this.businesses.concat(businesses) : businesses;

            if (event)
                event.target.complete();

            this.loading = false
        }
        catch (err) {
            this.toastError(err);
            console.error(err);
            if (event)
                event.target.complete();

            this.loading = false
        }
    }

    doInfinite(ev) {
        if(!this.searchString || this.searchString.trim()=="")
        this.getBusinesses(ev, true)
    }
    cancelSearch() {
        this.getBusinesses(null, false)
    }

    openBusiness(business){
        this.navCtrl.navigateForward("businesses/"+business.id,{animated:true})
    }

    debounce;
    searchBusinesses(ev) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            console.log(ev.target.value);
            let val = ev.target.value;
            if (val && val.trim().length > 3) {
                this.loading = true;
                this.businessService.searchBusinesses(val,null).subscribe(
                    businesses => {
                        console.log("found businesses",businesses)
                        this.loading = false;
                        this.businesses = businesses;
                    },
                    err => {
                        console.error(err);
                        this.loading = false;
                    }
                );
            }
            else if (!val || val.trim().length == 0)
                this.getBusinesses(null, false)
        }, 500);
    }



    async getPosition(): Promise<[number, number]> {
        this.positioning = true;
        try {
            let location = await this.locationService.getPosition()
            this.positioning = false;
            this.geocoding.geocode(location.coords.longitude,
                location.coords.latitude).subscribe(result => {
                    console.log("geocoding", result)
                    this.locationName = result;

                    this.zone.run(() => { })
                }, err => {
                    console.error(err)
                    this.toastError(err.message || err)
                })
            return [
                location.coords.longitude,
                location.coords.latitude
            ];
        } catch (e) {
            this.positioning = false;
            this.toastError(e.message || e)
            console.error(e);
            return null;
        }
    }


    async toastError(loginErrorString) {
        let toast = await this.toastCtrl.create({
            message: loginErrorString,
            duration: 3000,
            position: "top"
        });
        toast.present();
    }
}
