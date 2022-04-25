import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessDetailPage } from './business-detail.page';
import { ChannelComponentsModule } from 'app/gc_basic/channel-components/channel.components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'app/gc_basic/shared-components/shared.components.module';
import { MapsComponentsModule } from 'app/gc_basic/map-components/maps.components.module';
import { MapsModalsModule } from 'app/gc_basic/map-modals/maps-modals.module';

import { SharedDirectivesModule } from 'app/gc_basic/shared-directives/shared.directives.module';
import { ManageMemberPopover } from './manage-member.popover';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: BusinessDetailPage
      }
    ]),
    TranslateModule,

    ChannelComponentsModule,
    FormsModule, ReactiveFormsModule,
    ChannelComponentsModule,
    MapsComponentsModule,
    SharedComponentsModule,
    MapsModalsModule,

    SharedDirectivesModule,


  ],
  declarations: [BusinessDetailPage,ManageMemberPopover],
  providers: []
})
export class BusinessDetailPageModule { }