import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  ToastController,
  LoadingController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { Channel } from "app/gc_basic/models/channel";

import { PostLabel } from "app/p_csr/models/postLabel";
import { v4 as uuidv4 }from "uuid";
import { PostLabelService } from "app/p_csr/services/post-label.service";

@Component({
  selector: "post-label-form",
  templateUrl: "post-label-form.modal.html",
  styles: [
    `
   
    `
  ]
})
export class PostLabelFormModal {


  writeMode: "new" | "edit"
  labelLanguages: string[] = []
  selectedLanguage: string;
  allowLanguageManipulation: boolean = true


  @ViewChild("labelForm", { static: false }) labelForm: NgForm;
  labelChanged: boolean;

  label: PostLabel
  channel: Channel;
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private postLabelService: PostLabelService,
    private translate: TranslateService,
    private alertCtrl: AlertController,
  ) {



  }
  async ngOnInit() {



    if (!this.label) {
      this.writeMode = "new";
      this.label = new PostLabel(
        uuidv4(),
        this.channel.id,
        null,
        null,
        "#e67417"
      );
      this.label.translations = [];

      this.prepareForms();
    } else {
      this.writeMode = "edit";
      this.prepareForms();
    }

    if (this.labelLanguages.length == 0)
      try {


        let availableLanguages = this.channel.languages;

        if (this.writeMode == "new") {
          let language =
            availableLanguages.findIndex(l => l.code == navigator.language) != -1
              ? navigator.language
              : availableLanguages[0].code;
          this.onAddLanguage(language);
        } else {
          this.label.translations.forEach(t => this.onAddLanguage(t.locale));
        }
      } catch (e) {
        console.error(e);
      }
    else
      this.labelLanguages.forEach(l => {
        this.addLanguage(l);
      });
  }


  prepareForms() {
    console.log(this.label);


    setTimeout(() => {
      if (this.labelForm) {
        this.labelForm.form.valueChanges.subscribe(c => {
          this.labelChanged = true;

        });


      }


    }, 200);
  }



  async submitLabelForm() {

    if (!this.labelChanged) {
      this.modalCtrl.dismiss({ label: this.label });
      return;
    }

    let loading = await this.loadingCtrl.create({
      message: this.translate.instant("basic.loading")
    });
    loading.present();
    try {
      this.label = await this.postLabelService.putLabel(this.label, this.labelLanguages[0]).toPromise()
      console.log(this.label)
      loading.dismiss();
      this.modalCtrl.dismiss({ label: this.label });
    } catch (e) {
      console.error(e)
      this.toastError(e)
      loading.dismiss();
    }


  }


  onLanguageSelected(language: string) {
    this.selectedLanguage = language;
  }

  onAddLanguage(language: string) {
    this.labelLanguages.push(language);
    this.addLanguage(language);
  }

  onRemoveLanguage(language: string) {
    let i = this.labelLanguages.indexOf(language);
    this.labelLanguages.splice(i, 1);
    this.removeLanguage(language);
  }

  async askForLanguageRemoval(language: string) {
    let alert = await this.alertCtrl.create({
      subHeader: this.translate.instant("basic.remove-language"),
      buttons: [
        {
          text: this.translate.instant("basic.no"),
          role: "cancel",
        },
        {
          text: this.translate.instant("basic.yes"),
          role: "destructive",
        }

      ]
    })
    alert.present()
    let res = await alert.onDidDismiss()

    if (res && res.role == 'destructive')
      this.onRemoveLanguage(language)
  }

  addLanguage(language: string) {
    console.log("add language", language);

    if (!language || !this.label) return;

    //question
    let t = this.label.translations.find(t => t.locale == language);
    if (!t)
      this.label.translations.push({
        id: null,
        locale: language,
        post_label_id: this.label.id,
        label: "",
        description: ""
      });
  }

  async removeLanguage(language: string) {
    try {
      delete this.label[language]
      this.label.translations = this.label.translations.filter(t => t.locale != language)
      await this.postLabelService
        .deletLabelTranslation(this.label, language)
        .toPromise();
    } catch (e) {
      console.error(e);
    }
  }


  async delete() {
    let alert = await this.alertCtrl.create({
      header: this.translate.instant("basic.label-delete"),
      subHeader: this.translate.instant("basic.label-delete-desc"),
      buttons: [
        {
          text: this.translate.instant("basic.cancel"),
          role: "cancel",
        },
        {
          text: this.translate.instant("basic.delete"),
          handler: async () => {
            let loading = await this.loadingCtrl.create({
              message: this.translate.instant("basic.loading")
            });
            loading.present();
            try {
              if (this.label.created_at)
                await this.postLabelService.deleteLabel(this.label.id).toPromise()
              loading.dismiss()
              this.modalCtrl.dismiss({ consent: null })

            } catch (e) {
              console.error(e)
              this.toastError(e)
              loading.dismiss()
            }
          }
        }
      ]
    })
    alert.present()
  }



  close() {
    this.modalCtrl.dismiss();
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