import { Component } from "@angular/core";
import {
  ToastController,
  ModalController,
} from "@ionic/angular";

import { Channel } from "app/gc_basic/models/channel";
import { PostLabel } from "app/p_csr/models/postLabel";
import { PostLabelFormModal } from "./post-label-form.modal";
import { PostLabelService } from "app/p_csr/services/post-label.service";


@Component({
  selector: "post-labels-modal",
  templateUrl: "post-labels.modal.html",
  styles: [
    `
    .system{
      color:grey;
      font-size: 0.8em;
    
      font-variant: small-caps;
    }
    `
  ]

})
export class PostLabelsModal {

  loading: boolean
  channel: Channel;
  labels: PostLabel[]

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private postLabelService: PostLabelService,

  ) {



  }
  ngOnInit() {
    this.getLabels(true);
  }

  async refresh(ev) {
    await this.getLabels(false);
    ev.target.complete();
  }

  async getLabels(loading: boolean) {

    this.loading = loading;
    try {
      this.labels = await this.postLabelService.getLabels(this.channel.id).toPromise()
      


    } catch (e) {
      console.error(e)
      this.toastError(e)
    }
    this.loading = false;

  }






  async editLabel(label: PostLabel) {
    let modal = await this.modalCtrl.create({
      component: PostLabelFormModal,
      componentProps: {
        label: label,
        channel: this.channel
      }
    })
    modal.present();
    await modal.onDidDismiss();
    this.getLabels(true);

  }


  close() {
    this.modalCtrl.dismiss(this.labels);
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