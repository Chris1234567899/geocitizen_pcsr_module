import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ModalController, ToastController } from "@ionic/angular";
import { EditChannelSupporterModal } from "app/gc_basic/channel-modals/edit-channel-supporter/edit-channel-supporter.modal";
import { Channel } from "app/gc_basic/models/channel";
import { ChannelSponsorship } from "app/gc_basic/models/channel-sponsorship";
import { ChannelSupporter } from "app/gc_basic/models/channelSupporter";
import { ChannelService } from "app/gc_basic/services/channel.service";
import { UserProfileModal } from "app/gc_basic/shared-modals/user-profile/user-profile.modal";

@Component({
  selector: "channel-sponsorships",
  templateUrl: "channel-sponsorships.page.html",
  styleUrls: ["channel-sponsorships.page.scss"]
})
export class ChannelSponsorshipsPage {

  channelSlug: string;
  sponsorships: ChannelSponsorship[]
  supporters: ChannelSupporter[]
  loading: boolean

  channel: Channel
  constructor(
    private modalCtrl: ModalController,
    private channelService: ChannelService,
    private toastCtrl: ToastController,

    private route: ActivatedRoute,
  ) { }


  ionViewWillEnter() {


    this.channelSlug = this.route.snapshot.paramMap.get("slug")

    console.log(this.channelSlug)
    this.refresh(null)
  }



  async refresh(ev) {
    await this.getSupporters();
    await this.getSponsorShips(false, false);

    if (ev)
      ev.target.complete();
  }
  async getSponsorShips(loading: boolean, useOffset: boolean) {


    this.loading = loading;
    try {
      if (!this.channel)
        this.channel = await this.channelService.getChannel(this.channelSlug).toPromise()
      let sponsorships = await this.channelService.getChannelSponsorships(this.channel.id, useOffset ? this.sponsorships.length : 0, "").toPromise()
      this.sponsorships = useOffset ? this.sponsorships.concat(sponsorships) : sponsorships;

      console.log(this.sponsorships)
    } catch (e) {
      console.error(e)
      this.toastError(e)
    }
    this.loading = false;
  }
  async getSupporters() {

    try {
      if (!this.channel)
        this.channel = await this.channelService.getChannel(this.channelSlug).toPromise()
      let supporters = await this.channelService.getChannelSupporters(this.channel.id).toPromise()
      this.supporters =  supporters.sort((a, b) => a.order - b.order)
      console.log("channelSupporters", this.supporters)

    } catch (e) {
      console.error(e)

    }

  }


  async doInfinite(ev) {
    await this.getSponsorShips(ev, true)
    ev.target.complete();
  }


  
  masonryItems = [
    { title: 'item 1' },
    { title: 'item 2' },
    { title: 'item 3' },
  ];

  async toastError(loginErrorString) {
    let toast = await this.toastCtrl.create({
      message: loginErrorString,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  async openPeople(userRel) {

    let modal = await this.modalCtrl.create({
      component: UserProfileModal,
      componentProps: {
        user: userRel,

      }, cssClass: "large-modal"
    })
    modal.present()
  }
}