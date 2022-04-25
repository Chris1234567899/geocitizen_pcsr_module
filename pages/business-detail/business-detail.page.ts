import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AlertController, LoadingController, ModalController, NavController, PopoverController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Business } from "app/p_csr/models/business";
import { GcFile } from "app/gc_basic/models/file";
import { User } from "app/gc_basic/models/user";
import { BusinessService } from "app/p_csr/services/business.service";
import { FileService } from "app/gc_basic/services/file.service";
import { UserService } from "app/gc_basic/services/user.service";
import { UserProfileModal } from "app/gc_basic/shared-modals/user-profile/user-profile.modal";
import { v4 as uuidv4 } from "uuid";
import { ManageMemberPopover } from "./manage-member.popover";
import { BusinessMembership, BusinessRole } from "app/p_csr/models/businessMembership";


@Component({
  selector: "business-detail",
  templateUrl: "business-detail.page.html",
  styleUrls: ['business-detail.page.scss']
})
export class BusinessDetailPage {


  business: Business;
  user: User
  membership: BusinessMembership

  currentMemberships: BusinessMembership[]

  canEdit: boolean;



  constructor(


    private loadingCtrl: LoadingController,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private userService: UserService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
  }




  ionViewWillEnter() {

    this.loadBusiness();
  }

  async loadBusiness() {

    let businessId = this.route.snapshot.paramMap.get("businessId");
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();


    try {
      this.business = await this.businessService.getBusiness(businessId).toPromise();
      console.log("business", this.business)
      this.checkMembership()
      this.currentMemberships = this.business.business_memberships;
    } catch (e) {

      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()

  }

  checkMembership() {
    this.user = this.userService.getUser();

    console.log("user", this.user)
    if (!this.user)
      return;

    this.membership = this.business.business_memberships.find(r =>
      r.user_id == this.user.id);

    this.canEdit = this.membership
      && this.membership.status == "accepted"
      && this.membership.business_role == BusinessRole.Admin;

  }

  editBusiness() {
    this.navCtrl.navigateForward("businesses/" + this.business.id + "/edit", { animated: true })
  }

  async manageMember(ev, member: BusinessMembership) {

    let actions = [];

    switch (member.status) {
      case "accepted":
        if (member.business_role != BusinessRole.Admin)
          actions = ["admin", "remove", "block"]
        else
          actions = ["member", "remove", "block"]
        break;
      case "requested":
        actions = ["accept", "remove", "block"]
        break;
      case "invited":
        actions = ["remove"]
        break;
      case "blocked":
        actions = ["accept"]
        break;
      case null:
        actions = ["invite"]
        break;

    }
    if (actions.length == 0)
      return;





    let popover = await this.popoverCtrl.create({
      component: ManageMemberPopover,
      componentProps: {
        actions: actions,
      },
      event: ev
    })
    popover.present();

    let res = await popover.onDidDismiss();
    if (res.data) {
      switch (res.data) {
        case "accept":
          this.acceptMembership(member);
          break;
        case "remove":
          this.deleteMembership(member);
          break;
        case "block":
          this.blockMembership(member);
          break;

        case "invite":
          this.inviteMember(member);
          break;

        case "member":
        case "admin":
          this.giveRoleToMembership(member, res.data);
          break;
      }
    }

  }


  async joinBusiness() {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant("basic.join-business"),
      message: this.translate.instant("basic.join-business-desc"),
      buttons: [
        {
          role: "cancel",
          text: this.translate.instant("basic.cancel"),
        },
        {
          role: "ok",
          text: this.translate.instant("basic.yes"),
        }
      ]
    })
    alert.present();

    let res = await alert.onDidDismiss();
    if (res.role != "ok")
      return;

    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      this.membership = await this.businessService.requestMembership(this.business.id).toPromise();
      console.log("membership", this.membership)


      let idx = this.business.business_memberships.findIndex(m => m.user_id == this.membership.user_id)
      if (idx == -1)
        this.business.business_memberships.push(this.membership);
      else
        this.business.business_memberships[idx] = this.membership;


    } catch (e) {

      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()
  }
  async leaveBusiness() {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant("basic.leave-business"),
      message: this.translate.instant("basic.leave-business-desc"),
      buttons: [
        {
          role: "cancel",
          text: this.translate.instant("basic.cancel"),
        },
        {
          role: "ok",
          text: this.translate.instant("basic.yes"),
        }
      ]
    })
    alert.present();

    let res = await alert.onDidDismiss();
    if (res.role == "ok")
      this.deleteMembership(this.membership);

  }
  async deleteMembership(membership: BusinessMembership) {

    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      await this.businessService.deleteMembership(this.business.id, membership.user_id).toPromise();

      if (membership == this.membership)
        this.membership = null;

      let idx = this.business.business_memberships.findIndex(m => m.user_id == membership.user_id)
      this.business.business_memberships.splice(idx, 1);

      console.log("membership", membership)
      this.cancelSearch();

    } catch (e) {

      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()
  }

  async acceptMembership(member: BusinessMembership) {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      let membership = await this.businessService.acceptMembership(this.business.id, member.user_id).toPromise();
      console.log("membership", membership)
      let idx = this.business.business_memberships.findIndex(m => m.user_id == membership.user_id)
      this.business.business_memberships[idx] = membership;
      this.cancelSearch();
    } catch (e) {
      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()
  }


  async blockMembership(member: BusinessMembership) {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      let membership = await this.businessService.blockMembership(this.business.id, member.user_id).toPromise();
      console.log("membership", membership)
      let idx = this.business.business_memberships.findIndex(m => m.user_id == membership.user_id)
      this.business.business_memberships[idx] = membership;
      this.cancelSearch();
    } catch (e) {
      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()
  }


  async giveRoleToMembership(member: BusinessMembership, role: BusinessRole) {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      let membership = await this.businessService.giveRoleToMembership(this.business.id, member.user_id, role).toPromise();
      console.log("membership", membership)
      let idx = this.business.business_memberships.findIndex(m => m.user_id == membership.user_id)
      this.business.business_memberships[idx] = membership;
      this.cancelSearch();
    } catch (e) {
      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()
  }




  async inviteMember(member: BusinessMembership) {
    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      let membership = await this.businessService.inviteMember(this.business.id, member.user_id).toPromise();
     
      console.log("membership", membership)
      let idx = this.business.business_memberships.findIndex(m => m.user_id == membership.user_id)
      if (idx == -1)
        this.business.business_memberships.push(membership);
      else
        this.business.business_memberships[idx] = membership;


        this.cancelSearch();
    } catch (e) {
      console.error(e)
      this.toastError(e)
    }
    loading.dismiss()

  }


  async openPeople(userRel) {
    let modal = await this.modalCtrl.create({
      component: UserProfileModal,
      componentProps: {
        user: userRel

      } , cssClass: "large-modal"
    })
    modal.present()
  }




  debounce
  searchUsers(ev) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(async () => {
      console.log(ev.target.value);
      let val: string = ev.target.value;
      if (val && val.trim().length > 3) {


        try {
          let users = await this.businessService.searchMemberships(val, this.business.id).toPromise()
          console.log("searched users", users)


          this.currentMemberships = users.map(u => {

            if (u.business_membership) {
              let membership = u.business_membership;
              membership.user_rel = u;

              return membership;
            } else {
              let membership = new BusinessMembership()
              membership.id = uuidv4();
              membership.business_id = this.business.id;
              membership.user_id = u.id;
              membership.status = null;
              membership.business_role = BusinessRole.Member;
              membership.user_rel = u;
              return membership
            }
          })

        } catch (e) {
          console.error(e)
        }

      } else
        this.currentMemberships = this.business.business_memberships;

    }, 500);
  }
  cancelSearch() {
    this.currentMemberships = this.business.business_memberships;
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