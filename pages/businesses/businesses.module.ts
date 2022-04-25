import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessesPage } from './businesses.page';
import { ChannelModalsModule } from 'app/gc_basic/channel-modals/channel-modals.module';
import { SharedComponentsModule } from 'app/gc_basic/shared-components/shared.components.module';
import { SharedDirectivesModule } from 'app/gc_basic/shared-directives/shared.directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({

  entryComponents:[

  ],
  exports:[

  ],
  imports: [
    CommonModule,
    IonicModule,
    
    RouterModule.forChild([
      {
        path: '',
        component: BusinessesPage
      }
    ]),
    TranslateModule,
    ChannelModalsModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  declarations: [BusinessesPage],
  
  providers:[]
})
export class BusinessesPageModule {}