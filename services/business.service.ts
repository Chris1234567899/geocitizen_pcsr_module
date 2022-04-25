import { Injectable, Inject } from "@angular/core";
import { catchError, retry } from "rxjs/operators";
import { ErrorExtractor } from "../../gc_basic/error-extractor";
import { Observable } from "rxjs";
import { Env } from "../../gc_basic/interfaces/env.interface";
import { HttpClient } from "@angular/common/http";
import { Business } from "../models/business";
import { BusinessRole, BusinessMembership } from "../models/businessMembership";
import { User } from "../../gc_basic/models/user";



@Injectable()
export class BusinessService {
  constructor(public http: HttpClient, @Inject('env') private env: Env) {

  }


  getBusiness(id: string) {
    return <Observable<Business>>(
      this.http
        .get(this.env.api_url + "/api/businesses/" + id)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  getBusinesses(offset: number, params: string) {
    return <Observable<Business[]>>(
      this.http
        .get(this.env.api_url + "/api/businesses/all/" + offset + params)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  searchBusinesses(search: string, businessId: string) {

    let params = businessId ? "?current=" + businessId : "";
    return <Observable<Business[]>>(
      this.http
        .post(
          this.env.api_url + "/api/businesses/search" + params,
          { search: search }
        )
        .pipe(
          catchError(ErrorExtractor.handleError)
        )
    );

  }

  putBusiness(business: Business) {
    return <Observable<Business>>(
      this.http
        .put(this.env.api_url + "/api/businesses", business)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  deleteBusiness(id: string) {
    return <Observable<any>>(
      this.http
        .delete(this.env.api_url + "/api/businesses/" + id)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  requestMembership(businessId: string) {
    return <Observable<BusinessMembership>>(
      this.http
        .post(this.env.api_url + "/api/businesses/" + businessId + "/join", null)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  deleteMembership(businessId: string, userId: string) {
    return <Observable<BusinessMembership>>(
      this.http
        .delete(this.env.api_url + "/api/businesses/" + businessId + "/delete/" + userId)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }
  blockMembership(businessId: string, userId: string) {
    return <Observable<BusinessMembership>>(
      this.http
        .post(this.env.api_url + "/api/businesses/" + businessId + "/block/" + userId, null)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }
  acceptMembership(businessId: string, userId: string) {
    return <Observable<BusinessMembership>>(
      this.http
        .post(this.env.api_url + "/api/businesses/" + businessId + "/accept/" + userId, null)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  inviteMember(businessId: string, userId: string) {
    return <Observable<BusinessMembership>>(
      this.http
        .post(this.env.api_url + "/api/businesses/" + businessId + "/invite/" + userId, null)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }
  giveRoleToMembership(businessId: string, userId: string, role: BusinessRole) {
    return <Observable<BusinessMembership>>(
      this.http
        .post(this.env.api_url + "/api/businesses/" + businessId + "/set-role/" + userId,
          {
            role: role
          })
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }



  searchMemberships(val, businessId) {
    return <Observable<User[]>>(
      this.http.post(this.env.api_url + "/api/businesses/" + businessId + "/search-memberships", { search: val }).pipe(
        retry(3),
        catchError(ErrorExtractor.handleError)
      )
    );
  }

}







