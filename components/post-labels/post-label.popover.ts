import { Component } from '@angular/core';
import {  ModalController, PopoverController, ToastController } from '@ionic/angular';
import { Channel } from 'app/gc_basic/models/channel';
import { ChannelRole } from 'app/gc_basic/models/channelSubscription';
import { PortalRole } from 'app/gc_basic/models/portalSubscription';
import { Post } from 'app/gc_basic/models/post';
import { PostLabel } from 'app/p_csr/models/postLabel';
import { ChannelService } from 'app/gc_basic/services/channel.service';
import { PortalService } from 'app/gc_basic/services/portal.service';
import { PostLabelsModal } from '../post-labels/post-labels.modal';


@Component({
    selector: 'post-label-popover',

    styles: [
        `
      
        .start{

        }
        ion-avatar{
            height: 20px;
            width: 20px;
            align-self: flex-start;
            margin-top: 1em;
          }
        `
    ],

    template: ` 
    <ion-list>
        <ion-item button *ngFor="let label of labels"
         (click)="labelPost(label)">
            <ion-avatar slot="start"  [ngStyle]="{background: label.color}"> </ion-avatar>
            <ion-label class="ion-text-wrap">
                {{label.label}}
                <br>
                <small> {{label.description}}</small>
            </ion-label>
        </ion-item>


        <ion-item button lines="none" *ngIf="channelRole == 'moderator' || channelRole == 'admin' ||  portalRole == 'admin'"
        (click)="manageLabels()">
            <ion-icon slot="start" name="settings"></ion-icon>
           <ion-label class="ion-text-wrap">
             {{"basic.manage-labels" | translate }}
           </ion-label>
       </ion-item>
    </ion-list>


    `,


})

export class PostLabelPopover {
    post: Post
    
    channel: Channel
    labels: PostLabel[]
    currentLabels:  PostLabel[]
    channelRole: ChannelRole;
    portalRole: PortalRole


   

    constructor(private popoverCtrl: PopoverController,

        private channelService: ChannelService,
        private portalService: PortalService,
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
      ) { }
    ngOnInit() {
        this.channelRole = this.channelService.getChannelRole(this.post.channel_id)
        this.portalRole = this.portalService.PortalRole;

        this.filterLabels(this.labels);
    }
    filterLabels(labels) {
        this.labels = labels.filter(l => 
            
            this.currentLabels.findIndex(cl=>
                cl.id == l.id
                )==-1
        )
    }




    

    labelPost(label:PostLabel){
        this.popoverCtrl.dismiss(label);
    }


    async manageLabels() {
        let modal = await this.modalCtrl.create({
            component: PostLabelsModal,
            componentProps: {
                channel: this.channel,
            }
        })
        modal.present();
        let res = await modal.onDidDismiss()
        if (res.data) {
            console.log(res.data)
            this.filterLabels(res.data);
        }
    }



    dismiss() {
        this.popoverCtrl.dismiss()
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