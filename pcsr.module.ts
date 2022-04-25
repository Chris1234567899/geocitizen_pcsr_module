import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";
import { IonicModule } from "@ionic/angular";

import { PCSRRoutingModule } from "./pcsr.routing.module";
import { Env } from "app/gc_basic/interfaces/env.interface";
import { PortalConf } from "app/gc_basic/interfaces/portal.interface";
import { BasicModule } from "app/gc_basic/basic.module";
import { PostLabelService } from "./services/post-label.service";
import { PCSRComponentsModule } from "./components/pcsr-components.module";

@NgModule({
  entryComponents: [



 
  ],
  imports: [
    PCSRRoutingModule,
    IonicModule,
    CommonModule,
    TranslateModule,
    HttpClientModule,
    PCSRComponentsModule
  ],
  declarations: [
  
  ],
  exports: [
 
  ],

  providers: [
    PostLabelService

  
  ]
})
export class PCSRModule {

  constructor() {}
  static forRoot(env: Env, portalConf: PortalConf): ModuleWithProviders<BasicModule> {
    return {
      ngModule: BasicModule,
      providers: [{ provide: "env", useValue: env }, { provide: "portalConf", useValue: portalConf }]
    };
  }
}
