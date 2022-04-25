import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core";
import { CanDeactivateGuard } from "app/gc_basic/can-deactivate.guard";
import { AuthGuard } from "app/gc_basic/auth.guard";


const routes: Routes = [
 
     //businesses
     {
      path: "businesses/new",
      loadChildren: () => import("./pages/edit-business/edit-business.module").then(m => m.EditBusinessPageModule),
      canActivate: [AuthGuard]
    },
    {
      path: "businesses",
      loadChildren: () => import("./pages/businesses/businesses.module").then(m => m.BusinessesPageModule),
    },
    {
      path: "businesses/:businessId",
      loadChildren: () => import("./pages/business-detail/business-detail.module").then(m => m.BusinessDetailPageModule),
      canActivate: [AuthGuard]
    },
    {
      path: "businesses/:businessId/edit",
      loadChildren: () => import("./pages/edit-business/edit-business.module").then(m => m.EditBusinessPageModule),
      canActivate: [AuthGuard]
    },
  
  
  {
    path: ":slug/sponsorships",
    loadChildren: () => import(
      "./pages/channel-sponsorships/channel-sponsorships.module").then(m => m.ChannelSponsorshipsPageModule),
  },




];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [
    CanDeactivateGuard,
  ]
})
export class PCSRRoutingModule {


}
