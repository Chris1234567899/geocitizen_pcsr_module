import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import {  ModalController,  ToastController } from "@ionic/angular";

import { Channel } from "app/gc_basic/models/channel";

import { loadScript, PayPalNamespace } from "@paypal/paypal-js";
import { Env } from "app/gc_basic/interfaces/env.interface";
import { PaymentService } from "app/p_csr/services/payment.service";
import { PortalService } from "app/gc_basic/services/portal.service";
import * as moment from "moment";


@Component({
  selector: "channel-sponsorship",
  templateUrl: "channel-sponsorship.modal.html",
  styleUrls: ["channel-sponsorship.modal.scss"]
})
export class ChannelSponsorshipModal {

  channel: Channel

  loading: boolean

  @ViewChild("paypal", { static: false }) paypalContainer: ElementRef


  pricings: Pricing[]
  selectedPricing: Pricing;


  endingDate: string;

  paid: boolean = false;


  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
   
    private portalService: PortalService,
    private paymentService: PaymentService,
    @Inject("env") private env: Env,

  ) { }

  async ngOnInit() {









    this.pricings = []


    var days: Pricing = {
      disabled: false,
      time: "DAY",
      price: this.channel.channel_pricing.price_per_day,
      amount: 3,
      save: null,
      min: 1,
      max: 30

    }
    var months: Pricing = {
      disabled: false,
      time: "MONTH",
      price: this.channel.channel_pricing.price_per_month,
      amount: 3,
      save: (1 - (this.channel.channel_pricing.price_per_month / (this.channel.channel_pricing.price_per_day * 31))) * 100,
      min: 1,
      max: 11
    }
    var years: Pricing = {
      disabled: false,
      time: "YEAR",
      price: this.channel.channel_pricing.price_per_year,
      amount: 1,
      save: (1 - (this.channel.channel_pricing.price_per_year / (this.channel.channel_pricing.price_per_day * 365))) * 100,
      min: 1,
      max: 3
    }

    if (this.channel.is_frozen) {
      switch (this.channel.channel_pricing.min_renewal_type) {
        case "YEAR":
          years.min = this.channel.channel_pricing.min_renewal_amount;
          years.amount = years.min;
          days.disabled = months.disabled = true;
          break;

        case "MONTH":
          months.min = this.channel.channel_pricing.min_renewal_amount;
          months.amount = months.min;
          days.disabled = true;
          break;

        case "DAY":
          days.min = this.channel.channel_pricing.min_renewal_amount;
          days.amount = days.min;
          break;

      }
    }

    this.pricings = [days, months, years];





    this.selectedPricing = this.pricings[1];
    this.calculateEnding();



    let paypal: PayPalNamespace;
    let portal = this.portalService.activePortal;
    console.log("portal", portal)
    try {



      paypal = await loadScript({


        "client-id": this.env.paypal_client_id,
        currency: "USD",
        "enable-funding": portal.paypal_funding_options,


        vault: true

        //sofort -> Europe
        //giropay -> DE
        //paylater -> virtual credit system???
        //sepa -> EU
        //p24 -> poland
        //blik -> poland
        //eps -> austria only
        //mercadopago -> LA
        //mybank-> italy/europe (sepa based)
        //bancontact -> belgium
        //venmo -> US only
        //ideal->dutch only



      });
    } catch (error) {
      console.error("failed to load the PayPal JS SDK script", error);
    }

    if (paypal && this.paypalContainer) {
      try {
        await paypal.Buttons({

          createOrder: (data, actions) => {
            return this.paymentService.createOrder(this.channel.id,
              this.selectedPricing.amount,
              this.selectedPricing.time,
            ).toPromise()
              .then((orderData) => {
                console.log(orderData);
                return orderData["id"];
              });
          },
          onApprove: (data, actions) => {
            return this.paymentService.approveOrder(data.orderID).toPromise()
              .then((orderData) => {
                console.log("response", orderData);

                this.paid = true;

              
              });
          },

          onCancel: (data) => {
            // Show a cancel page, or return to cart
            console.warn("paypal onCancel: ", data)
          },
          onError: (err) => {
            console.error("paypal onError: ", err)
          }
        }
        ).render(this.paypalContainer.nativeElement);
      } catch (error) {
        console.error("failed to render the PayPal Buttons", error);
      }
    }
  }




  selectPricing(pricing: Pricing) {
    this.selectedPricing = pricing;
    this.calculateEnding();
  }
  setAmount(ev, amount: number) {
    ev.stopPropagation();

    this.selectedPricing.amount += amount;

    this.selectedPricing.amount = this.selectedPricing.amount < this.selectedPricing.min ? this.selectedPricing.min :
      this.selectedPricing.amount > this.selectedPricing.max ? this.selectedPricing.max : this.selectedPricing.amount;

    this.calculateEnding();
  }
  calculateEnding() {
    var supported = moment(this.channel.channel_pricing.supported_until);

    var currentEnding = moment();
    if (supported.isAfter(currentEnding))
      currentEnding = supported;


    this.endingDate = currentEnding.add(this.selectedPricing.amount,
      this.selectedPricing.time == "DAY" ? "days" :
        this.selectedPricing.time == "MONTH" ? "months" : "years"
    ).format();
  }


  close() {
    this.modalCtrl.dismiss()
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
interface Pricing {
  disabled: boolean,
  time: "DAY" | "MONTH" | "YEAR",
  price: number,
  amount: number,
  save: number,
  min: number,
  max: number
}