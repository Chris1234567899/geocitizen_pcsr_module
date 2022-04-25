import { Component } from "@angular/core"
import { ModalController, ToastController } from "@ionic/angular"
import { Channel } from "app/gc_basic/models/channel"
import { Post, PostType } from "app/gc_basic/models/post"


@Component({
    selector: "post-sponsorship-form",
    templateUrl: "post-sponsorship-form.modal.html",
    styleUrls: ["post-sponsorship-form.modal.scss"],
})
export class PostSponsorshipFormModal {
    writeMode: "new" | "edit" = "new"
    parentPost: Post
    post: Post
    channel: Channel
    postType = PostType

    constructor(
        private modalCtrl: ModalController,
        private toastCtrl: ToastController,
    ) { }


    onEditCancel() {
        this.modalCtrl.dismiss()
    }
    onPostSaved(post) {
        this.modalCtrl.dismiss(post)
    }
    close() {
        this.modalCtrl.dismiss()

    }

    async toastError(loginErrorString) {
        let toast = await this.toastCtrl.create({
            message: loginErrorString,
            duration: 3000,
            position: "top",

        });
        toast.present();
    }
}