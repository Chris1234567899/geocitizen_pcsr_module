import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import { ChannelService } from '../gc_basic/services/channel.service';

@Injectable({
  providedIn: 'root'
})
export class FrozenGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private channelService: ChannelService,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    let p = new Promise<boolean>(async resolve => {
      let loading = await this.loadingCtrl.create({
        message: this.translate.instant("basic.loading")
      });
      loading.present();

      try {
        let slug = next.paramMap.get("slug");
        let channel = await this.channelService.getChannel(slug).toPromise();
        loading.dismiss();
        if (channel.is_frozen) {
          this.toastError(this.translate.instant("basic.channel-frozen"));
          resolve(false)
          return;
        }
        else
          resolve(true)
        
      } catch (e) {
        loading.dismiss();
        console.error(e)
        this.toastError(e)
        resolve(false);

      }
    });
    return <Observable<boolean>>from(p);

  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
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



