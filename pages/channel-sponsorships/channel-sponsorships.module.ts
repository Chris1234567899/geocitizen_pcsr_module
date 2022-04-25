import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChannelSponsorshipsPage } from './channel-sponsorships.page';
import { ChannelComponentsModule } from 'app/gc_basic/channel-components/channel.components.module';
import { ChannelModalsModule } from 'app/gc_basic/channel-modals/channel-modals.module';
import { SharedComponentsModule } from 'app/gc_basic/shared-components/shared.components.module';
import { SharedModalsModule } from 'app/gc_basic/shared-modals/shared-modals.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChannelSponsorshipsPage
      }
    ]),
    TranslateModule,

    ChannelComponentsModule,
    ChannelModalsModule,
    SharedComponentsModule,
    SharedModalsModule,
   





  ],
  entryComponents: [
    
  ],
  declarations: [ChannelSponsorshipsPage],
  providers:[],


})
export class ChannelSponsorshipsPageModule {}
