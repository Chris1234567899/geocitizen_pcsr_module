import { Injectable, Inject, } from "@angular/core";
import { catchError, retry, } from "rxjs/operators";
import { HttpClient, } from "@angular/common/http";
import { ErrorExtractor } from "../../gc_basic/error-extractor";
import { Env } from "../../gc_basic/interfaces/env.interface";



@Injectable()
export class PaymentService {

  constructor(
    private http: HttpClient,
    @Inject("env") private env: Env,


  ) {


  }


  createOrder(channelId: string, amount: number,time:string) {
    return this.http
      .post(this.env.api_url + "/api/payments/order/create", {
        channel_id: channelId,
        amount: amount,
        time:time,
      })
      .pipe(
        catchError(ErrorExtractor.handleError)
      );
  }
  approveOrder(orderId: string) {
    return this.http
      .post(this.env.api_url + "/api/payments/order/capture", {
        order_id: orderId,
      })
      .pipe(
        catchError(ErrorExtractor.handleError)
      );
  }

}
