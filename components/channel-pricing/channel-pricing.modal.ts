import { Component } from "@angular/core";
import { LoadingController, ModalController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Channel } from "app/gc_basic/models/channel";
import { ChannelService } from "app/gc_basic/services/channel.service";
import { ChannelPricingService } from "app/p_csr/services/channelPricingService";

@Component({
    selector: "channel-pricing",
    templateUrl: "channel-pricing.modal.html",
    styles: [
        `
        .currency-input{
            border: 0;
            width: 35%;
        }
        .save-price{
            color:var(--ion-color-gold);
            margin: 0;
        }
        .renewal-line{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
        }
     
   
      `
    ]
})
export class ChannelPricingModal {
    channel: Channel;

    constructor(
        private modalCtrl: ModalController,
        private translate: TranslateService,
        private channelService: ChannelService,
        private pricingService: ChannelPricingService,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
   


    ) { }
   async ngOnInit(){
      

    }

   async updatePricing(){
        let loading = await this.loadingCtrl.create({
            message: this.translate.instant("basic.loading")
        });
        loading.present();
        try {


            let pricing = await this.pricingService.updatePricing(this.channel.channel_pricing).toPromise()
            console.log("updated channel pricing", pricing)

            this.channel.channel_pricing = pricing;
            this.channelService.updateCache(this.channel);

            loading.dismiss()

            this.modalCtrl.dismiss();
        } catch (e) {
            loading.dismiss()
            console.error(e)
            this.toastError(e)
        }
    }

    close() {
        this.modalCtrl.dismiss();
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