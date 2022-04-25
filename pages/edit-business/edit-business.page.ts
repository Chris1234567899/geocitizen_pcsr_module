import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, ModalController, NavController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { LocateModal } from "app/gc_basic/map-modals/locate/locate.modal";
import { Business } from "app/p_csr/models/business";
import { GcFile } from "app/gc_basic/models/file";
import { BusinessService } from "app/p_csr/services/business.service";
import { FileService } from "app/gc_basic/services/file.service";
import { GeoCodingFeature, GeocodingService } from "app/gc_basic/services/geocoding.service";
import { LocationService } from "app/gc_basic/services/location.service";
import { UserService } from "app/gc_basic/services/user.service";
import { v4 as uuidv4 } from "uuid";


@Component({
  selector: "edit-business",
  templateUrl: "edit-business.page.html",
  styleUrls: ['edit-business.page.scss']
})
export class EditBusinessPage {


  writeMode: "new" | "edit";
  business: Business;
  businessChanged: boolean;
  coverImage: string
  logoImage: string

  positioning: boolean

  @ViewChild("businessForm", { static: false }) businessForm: NgForm;


  showSimilar: boolean;
  similarBusinesses: Business[] = [];


  searchSuggestions: GeoCodingFeature[];


  constructor(

    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private businessService: BusinessService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private navCtrl: NavController,
    private geocoding: GeocodingService,
    private modalCtrl: ModalController,
    private userService: UserService,

  ) {
  }




  ngOnInit() {

    this.getBusiness();
  }

  async getBusiness() {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {

      let businessId = this.route.snapshot.paramMap.get("businessId");
      if (!businessId) {
        this.writeMode = "new";
        this.business = new Business(
          uuidv4(),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );


        this.prepareForms();

        loading.dismiss()
      } else {
        this.writeMode = "edit";
        this.business = await this.businessService.getBusiness(businessId).toPromise()
        console.log(this.business);
        this.prepareForms();
        loading.dismiss()
      }



    }
    catch (err) {
      console.error(err);
      loading.dismiss()
      this.toastError(err)
    }
  }

  prepareForms() {
    setTimeout(() => {
      if (this.businessForm) {
        this.businessForm.form.valueChanges.subscribe(c => {
          this.businessChanged = true;
        });
      }
    });

  }

  async submitBusinessForm() {
    console.log(this.business)

    if (!this.businessChanged) {
      this.navCtrl.pop();
      return;
    }


    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {

      if (this.coverImage) {
        let res = await this.uploadPhoto(this.coverImage)
        console.log("uploaded cover")
        this.business.cover_image_url = res.uri;
      }
      if (this.logoImage) {
        let res = await this.uploadPhoto(this.logoImage)
        console.log("uploaded logo")
        this.business.logo_image_url = res.uri;
      }

      let business = await this.businessService.putBusiness(this.business).toPromise()
      console.log("business uploaded", business);

      await this.userService.refreshUser().toPromise()

      await loading.dismiss();
      this.navCtrl.navigateBack("businesses/" + business.id);
    } catch (e) {
      console.error(e);
      loading.dismiss();
      this.toastError(e);
    }
  }


  async deleteBusiness() {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant("basic.delete-business-now"),
      message: this.translate.instant("basic.delete-business-desc"),
      buttons: [
        {
          role: "cancel",
          text: this.translate.instant("basic.cancel")
        },
        {
          text: this.translate.instant("basic.delete"),
          handler: async () => {
            let loading = await this.loadingCtrl.create({
              message: this.translate.instant("basic.loading")
            });
            loading.present();
            try {

              let del = await this.businessService
                .deleteBusiness(this.business.id)
                .toPromise();
              console.log("deleted business", del);
              await this.userService.refreshUser().toPromise()
              loading.dismiss()

              this.navCtrl.navigateBack("/")
            } catch (e) {
              console.error(e);
              this.toastError(e);
              loading.dismiss()
            }
          }
        }
      ]
    });
    alert.present();
  }

  onImageData(imageData: string, type: "cover" | "logo") {
    if (type == "cover")
      this.coverImage = imageData;
    else
      this.logoImage = imageData;

    this.businessChanged = true;
  }


  getBackgroundImage(type: "cover" | "logo") {
    if (type == "cover")
      return this.coverImage ? this.coverImage : this.business.cover_image_url
    else
      return this.logoImage ? this.logoImage : this.business.logo_image_url
  }


  async uploadPhoto(imgData: string): Promise<{ uri: string; file: GcFile }> {

    let blob = await this.fileService.base64ToBlob(imgData)
    return <any>this.fileService.uploadFile(blob, "image", uuidv4()).toPromise();
  }




  debounce: any;
  searchLocation(ev) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.searchSuggestions = [];
      let val = ev.target.value
      if (val && val.trim().length > 3) {
        console.log("search", val);
        this.geocoding.reverseGeocode(val, 8).subscribe(
          features => {
            this.searchSuggestions = features;
            console.log("complete searchSuggestions", this.searchSuggestions);
          },
          err => {
            console.error(err);
          }
        );
      }
      else
        this.searchSuggestions = [];
    }, 500);
  }
  selectSuggestion(suggestion:GeoCodingFeature){
    console.log("selected",suggestion)
    this.business.location = suggestion.place_name;
    this.business.geometry = suggestion.geometry;
    this.searchSuggestions = [];
    this.businessChanged = true;
  
  }



  async removeLocation() {
    this.business.location = null;
    this.business.geometry = null;

    this.businessChanged = true;

  }



  debouncer: any;
  findSimilarBusinesses(ev) {
    let val = ev.target.value;
    if (val && val.trim().length > 3) {
      console.log("findSimilarBusinesses", val);

      if (this.debouncer) clearTimeout(this.debouncer);
      this.debouncer = setTimeout(() => {

        this.businessService.searchBusinesses(val, this.business.id).subscribe(
          similarBusinesses => {
            console.log(similarBusinesses);
            this.similarBusinesses = similarBusinesses; //.filter(c => c.id != this.channel.id);
            this.showSimilar = this.similarBusinesses.length > 0;
          },
          err => {
            console.error(err);
          }
        );
      }, 300);
    }
  }

  openBusiness(business: Business) {
    this.navCtrl.navigateForward("businesses/" + business.id, {
      animated: true
    });
  }


  closeSimilar() {
    this.showSimilar = false;
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