
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CommonService } from '../softcafe/common/common.service';


@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {

  constructor(private http: HttpClient, private cs: CommonService) { }

  // downloadSignature(path: string, formData?: FormData): Observable<any> {
  //   const url = `${environment.SERVER_BASE_URL}/${path}`;
  //   const req = new HttpRequest('POST', url, formData, {
  //     reportProgress: true,
  //     responseType: 'arraybuffer'
  //   });
  //   return this.http.request(req);
  // }

  downloadSignature(path: string, formData?: FormData): Observable<any> {
    debugger
    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem("AUTH_TOKEN"),
      'UserId': this.cs.getUserId() + '',
      responseType: 'arraybuffer',
      // responseType: 'blob',
      // observe: 'event'
      observe: 'events',
    });
    const url = `${environment.SERVER_BASE_URL}/${path}`;
    const req = new HttpRequest('POST', url, formData ?? new FormData(), {
      reportProgress: true,
      responseType: 'arraybuffer',
      withCredentials: true,
      headers: headers,
    });
    return this.http.request(req);

  }


}