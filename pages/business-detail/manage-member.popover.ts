import { Component } from '@angular/core'
import {  PopoverController } from '@ionic/angular';

@Component({
  selector: 'manage-member-popover',

  styles: [
    `
      

        `
  ],

  template: ` 
    <ion-list >

        <ion-item *ngFor="let action of actions" button (click)="handleMember(action)">
          {{ "basic.business-action-"+action | translate}}
        </ion-item>


    </ion-list>


    `,


})

export class ManageMemberPopover {


  actions:string[]

  constructor(
    private popoverCtrl: PopoverController,
  ) { }







  handleMember(action) {
    this.popoverCtrl.dismiss(action)
  }




  dismiss() {
    this.popoverCtrl.dismiss()
  }

}