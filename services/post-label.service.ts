import { Injectable, Inject } from "@angular/core";
import { catchError, retry } from "rxjs/operators";
import { ErrorExtractor } from "../../gc_basic/error-extractor";
import { Observable } from "rxjs";
import { Env } from "../../gc_basic/interfaces/env.interface";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PostLabel } from "../models/postLabel";
import { LanguageInterceptorSkipHeader } from "app/gc_basic/interfaces/skip.header";
import { Post } from "app/gc_basic/models/post";


@Injectable()
export class PostLabelService {
  constructor(public http: HttpClient, @Inject('env') private env: Env) {

  }

  
  getLabels(channelId: string) {
    return <Observable<PostLabel[]>>(
      this.http
        .get(this.env.api_url + "/api/posts/labels/" + channelId)
        .pipe(
          catchError(ErrorExtractor.handleError))
    );
  }
  putLabel(label: PostLabel, locale: string): Observable<PostLabel> {

    label.translations.forEach(t => {
      label[t.locale] = t;
    });
    let headers = new HttpHeaders()
      .append("Content-Language", locale)
      .append(LanguageInterceptorSkipHeader, 'true')

    return <Observable<PostLabel>>this.http.put(this.env.api_url + "/api/posts/labels", label, { headers: headers })
      .pipe(
        retry(3),
        catchError(ErrorExtractor.handleError)
      );
  }

  deleteLabel(labelId) {
    return <Observable<PostLabel>>(
      this.http
        .delete(this.env.api_url + "/api/posts/labels/" + labelId)
        .pipe(
          catchError(ErrorExtractor.handleError))
    );
  }

  deletLabelTranslation(label: PostLabel, language: string) {
    return <Observable<any>>(
      this.http
        .delete(this.env.api_url + "/api/posts/labels/translations/" + label.id + "?language=" + language)
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }

  addLabel(postId: string,
    labelId: string
  ): Observable<Post> {
    return <Observable<Post>>(
      this.http
        .post(
          this.env.api_url + "/api/posts/" + postId + "/label/" + labelId, null
        )
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }
  removeLabel(postId: string,
    labelId: string
  ): Observable<any> {
    return <Observable<Post>>(
      this.http
        .delete(
          this.env.api_url + "/api/posts/" + postId + "/label/" + labelId
        )
        .pipe(catchError(ErrorExtractor.handleError))
    );
  }


}







