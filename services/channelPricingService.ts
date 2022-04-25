import { Injectable, Inject, } from "@angular/core";
import { Observable, } from "rxjs";
import { retry } from "rxjs/operators";
import { HttpClient,  } from "@angular/common/http";
import { ChannelPricing } from "../models/channelPricing";
import { Env } from "app/gc_basic/interfaces/env.interface";



@Injectable()
export class ChannelPricingService {


  constructor(
    private http: HttpClient,
    @Inject("env") private env: Env,
  ) {
 

  }

  updatePricing(pricing: ChannelPricing) {
    return <Observable<ChannelPricing>>(
      this.http
        .patch(this.env.api_url + "/api/channels/pricings", pricing)
        .pipe(
          retry(3),

        )
    );
  }
  
}
