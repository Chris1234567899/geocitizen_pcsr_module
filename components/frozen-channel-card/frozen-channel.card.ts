import { Component, Input } from "@angular/core";
import { LoadingController, ModalController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Channel } from "app/gc_basic/models/channel";
import { ChannelService } from "app/gc_basic/services/channel.service";
import * as moment from "moment";
import { ChannelSponsorshipModal } from "../channel-sponsorship/channel-sponsorship.modal";


@Component({
    selector: "frozen-channel-card",
    template: `


    <ion-item  class="frozen-warning" *ngIf="showWarning && !channel.is_frozen && !hideWarning" lines="none">
        <ion-icon name="snow" slot="start"></ion-icon>
        <ion-label class="ion-text-wrap">
        <h2>{{"basic.frozen-channel-warn" | translate}}</h2>
        <small>
            {{"basic.frozen-channel-warn-desc" | translate : {'date':channel.channel_pricing.supported_until | date } }}
        </small>
        </ion-label>

        <ion-button class="close" fill="clear" (click)="hideWarning = true" >
          <ion-icon name="close"></ion-icon>
        </ion-button>
    </ion-item>


    <ion-item *ngIf="channel.is_frozen && !hideFrozen" class="frozen" lines="none">
        <ion-icon name="snow" slot="start"></ion-icon>
        <ion-label class="ion-text-wrap">
        <h2>{{"basic.frozen-channel" | translate}}</h2>
        <small>
            {{"basic.frozen-channel-desc" | translate}}
        </small>
        </ion-label>

        <ion-button class="close" fill="clear" (click)="hideFrozen = true" >
          <ion-icon name="close"></ion-icon>
        </ion-button>
      
    </ion-item>

    <ion-item *ngIf="!hideSupport && (!importantOnly || channel.is_frozen) && !channel.channel_pricing.is_gratis" lines="none">
        <ion-button slot="end" shape="round" loginIntercept  [channelId]="channel.id"
        (clickEvent)="openSupport()" >
            {{"basic.support-channel" | translate }}
        </ion-button>
    </ion-item>
  `,

    styles: [
        `
        .frozen-warning{
            --background: lightskyblue;
            margin-top: 20px;
        }
        .frozen{
            --background: deepskyblue;
            margin-top: 20px;
        }  
        .close{
            top: 0;
            right: 0;
            color: white;
            position:absolute;
        } 
        `
    ]
})
export class FrozenChannelCard {

    @Input("channel") channel: Channel
    @Input("hideSupport") hideSupport: boolean
    @Input("importantOnly") importantOnly: boolean
    showWarning: boolean

    hideFrozen: boolean
    hideWarning: boolean

    constructor(private modalCtrl: ModalController,
        private channelService: ChannelService,
        private translate: TranslateService,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
    ) {

    }
    ngOnInit() {

        this.checkDate();
    }

    checkDate() {
        var supportedUntil = moment(this.channel.channel_pricing.supported_until);
        var now = moment();
        var days = supportedUntil.diff(now, 'days');
        if (days < 21 && !this.importantOnly && !this.channel.channel_pricing.is_gratis)
            this.showWarning = true;
    }

    async openSupport() {
        let modal = await this.modalCtrl.create({
            component: ChannelSponsorshipModal,
            componentProps: {
                channel: this.channel
            },
            cssClass: "large-modal"
        });
        modal.present();
        await modal.onDidDismiss();
        this.refreshChannel();


    }
    async refreshChannel() {
        let loading = await this.loadingCtrl.create({
            message: this.translate.instant("basic.loading")
        });
        loading.present();

        try {
            this.channel = await this.channelService.getChannel(this.channel.slug, true).toPromise()
            loading.dismiss();
            this.checkDate();
        } catch (e) {
            loading.dismiss();
            console.error(e)
            this.toastError(e)


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