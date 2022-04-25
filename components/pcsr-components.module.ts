import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChannelSponsorshipModal } from "./channel-sponsorship/channel-sponsorship.modal";
import { ChannelPricingModal } from "./channel-pricing/channel-pricing.modal";
import { NgxCurrencyModule } from "ngx-currency";
import { PaymentService } from "../services/payment.service";
import { PostLabelPopover } from "./post-labels/post-label.popover";
import { FrozenChannelCard } from "./frozen-channel-card/frozen-channel.card";
import { PostLabelComponent } from "./post-labels/post-label";
import { PostLabelsModal } from "./post-labels/post-labels.modal";
import { PostLabelFormModal } from "./post-labels/post-label-form.modal";
import { PostSponsorshipFormModal } from "./post-sponsorship-form/post-sponsorship-form.modal";
import { ChannelComponentsModule } from "app/gc_basic/channel-components/channel.components.module";


@NgModule({
  entryComponents: [

    ChannelPricingModal,
    ChannelSponsorshipModal,
    PostLabelPopover,
    PostLabelsModal,
    PostLabelFormModal,
    PostSponsorshipFormModal,
    PostLabelComponent

  ],
  declarations: [

    ChannelPricingModal,
    ChannelSponsorshipModal,
    PostLabelPopover,
    FrozenChannelCard,
    PostLabelComponent,
    PostLabelsModal,
    PostLabelFormModal,
    PostSponsorshipFormModal,
  ],

  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxCurrencyModule,
    
  ],

  exports: [
    PostLabelPopover,
    FrozenChannelCard,
    PostLabelComponent,
    PostLabelsModal,
    PostLabelFormModal,
  ],
  providers: [
    PaymentService

  ]
})
export class PCSRComponentsModule { }
