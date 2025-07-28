

/**
 * @author Md Kamruzzaman
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { parseBoolean } from 'angular-slickgrid';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActionType } from '../constants/action-type.enum';
import { ContentType } from '../constants/content-type.enum';
import { app } from './App';
import { AppRole } from './AppRole';
import { Constants } from './Constants';
import { Service } from './service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  app = app;

  constructor(private http: HttpClient, private router: Router) {
  }

  /**
   * This method responsible for communicating with server.
   * All request pass to server and return to sender [onResponse] if success.
   * if not access to server response will return to sender [onError] method
   * 
   * @param service Service
   * @param actionType ActionType
   * @param contentType ContentType
   * @param referance string
   * @param payload any
   */
  public sendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any) {
    this.doSendRequest(service, actionType, contentType, referance, payload);
  }

  public sendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestPublic(service, actionType, contentType, referance, payload, path);
  }



  private doSendRequestPublic(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? environment.SERVER_BASE_URL_PUBLIC + path : environment.SERVER_BASE_URL_PUBLIC + "/jsonRequest"

    this.http.post(url, req)
      .toPromise()
      .then(res => {
        service.onResponse(service, req, res);
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }

  public sendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {
    this.doSendRequestAdmin(service, actionType, contentType, referance, payload, path);
  }


  private doSendRequestAdmin(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any, path: string = null) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    var url = path ? environment.SERVER_BASE_URL_ADMIN + path : environment.SERVER_BASE_URL_ADMIN + "/jsonRequest"

    this.http.post(url, req)
      .toPromise()
      .then(res => {
        service.onResponse(service, req, res);
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }


  private doSendRequest(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    this.http.post(environment.SERVER_URL, req)
      .toPromise()
      .then(res => {
        service.onResponse(service, req, res);
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }

  public post(service: Service, actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var req = this.generateReqJson(actionType, contentType, referance, payload);

    return this.http.post(environment.SERVER_URL, req)
      .toPromise()
      .then(res => {
        return res;
      })
      .catch(res => {
        service.onError(service, req, res);
      });

  }



  public execute(actionType: ActionType, contentType: ContentType, payload: any) {

    var req = this.generateReqJson(actionType, contentType, '', payload);

    return this.http.post(environment.SERVER_URL, req);

  }

  public executePublic(actionType: ActionType, contentType: ContentType, payload: any, path = null) {

    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? environment.SERVER_BASE_URL_PUBLIC + path : environment.SERVER_BASE_URL_PUBLIC + "/jsonRequest"
    return this.http.post(url, req);

  }

  public executeAdmin(actionType: ActionType, contentType: ContentType, payload: any, path = null) {

    var req = this.generateReqJson(actionType, contentType, '', payload);
    var url = path ? environment.SERVER_BASE_URL_ADMIN + path : environment.SERVER_BASE_URL_ADMIN + "/jsonRequest"
    return this.http.post(url, req);

  }


  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }
  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }

  public generateReqJson(actionType: ActionType, contentType: ContentType, referance: string, payload: any) {

    var loginUser = this.loadLoginUser();
    var userId = null;
    if (loginUser && loginUser.userId) {
      userId = loginUser.userId;
    }
    var header = {
      actionType: actionType.toString(),
      contentType: contentType.toString(),
      referance: referance,
      userId: userId,
      extraInfoMap: {
        appName: app.constantAppName
      }
    };

    var data = {
      header: header,
      payload: payload instanceof Object ? [payload] : payload
    }
    return data;

  }

  public reqJson(actionType: ActionType, contentType: ContentType, referance: string, payload: any): string {

    var req = this.generateReqJson(actionType, contentType, referance, payload);
    return JSON.stringify(req);

  }

  public storeLoginUser(loginUser: any) {
    localStorage.setItem(Constants.APP_LOGIN_USER, JSON.stringify(loginUser));
  }

  public loadLoginUser(): any {
    var loginUser = localStorage.getItem(Constants.APP_LOGIN_USER)
    if (loginUser && loginUser != 'undefined') {
      return JSON.parse(loginUser);
    }
    else {
      return null;
    }
  }

  isSameUser(creatorId) {
    var loggged = this.loadLoginUser();
    if (loggged.loginName == 'softcafe') {
      return false;
    }
    return this.getUserId() == creatorId
  }

  forceAllow() {
    var logg = this.loadLoginUser();
    return logg?.loginName == 'softcafe'
  }

  public getUserId(): Number {
    var loginUser = this.loadLoginUser();
    console.log(loginUser);
    if (loginUser && loginUser.userId) {
      return loginUser.userId
    }
    return null;
  }

  isAuthenticated() {
    var auth = localStorage.getItem("IS_AUTHENTICATED");

    if (auth) {
      return parseBoolean(auth);
    }

    return false;
  }

  public loadLoginUserRoleList() {
    var loginUser = localStorage.getItem(Constants.APP_LOGIN_USER);
    if (loginUser) {
      return JSON.parse(loginUser).roleList;
    }
    else {
      return null;
    }
  }

  public logout(service: Service) {
    //if logged in status
    debugger
    if (this.isAuthenticated()) {
      var isLoggedIn = this.isLoggedIn();
      var loginUser = this.loadLoginUser();
      localStorage.removeItem('permission');

      //loginUser = this.loadLoginUser();
      var payload = {
        userId: loginUser.userId,
      }
      this.sendRequest(service, ActionType.LOGOUT, ContentType.User, 'logout', payload);

      // this.router.navigate(['/login'])
    }
  }

  removeSession() {
    localStorage.removeItem("IS_AUTHENTICATED");
    localStorage.removeItem("AUTH_TOKEN");
    localStorage.removeItem("agreement");
    localStorage.removeItem('profileImage');
    localStorage.clear();
    this.storeLoginUser({});
  }

  public getAgreement(): boolean {
    return localStorage.getItem('agreement') ? true : false;
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticated()
  }

  public hasAllRole(roleArray: AppRole[]): boolean {
    if (!roleArray) {
      return false;
    }
    var roles = this.loadLoginUserRoleList()
    if (!roles) {
      return false;
    }

    var roless = this.roleArray(roles)
    return roleArray.every(x => roless.indexOf(x) > -1)
  }
  private roleArray(roles) {
    var roleArray = [];
    if (!roles) {
      return roleArray;
    }

    for (var i = 0; i < roles.length; i++) {
      roleArray.push(roles[i].roleName);
    }
    return roleArray;

  }
  public hasAnyRole(roles: AppRole[]): boolean {

    if (!roles) {
      return false;
    }
    var loginUser = this.loadLoginUser();
    var userRoles = loginUser?.roleList;
    var loginRoleArray = this.roleArray(userRoles);
    if (!userRoles) {
      return false;
    }
    return roles.some(r => loginRoleArray.indexOf(r) >= 0);
  }

  public hasRole(role: AppRole): boolean {

    if (!role) {
      return false;
    }
    var loginUser = this.loadLoginUser();
    var userRoles = loginUser?.roleList;
    if (!userRoles) {
      return false;
    }
    
    return userRoles.some(s=> s.roleName == role);
  }

  // public filePostBySecure(path: string, formData: FormData, header?: HttpHeaders) {

  //   let headers = new HttpHeaders({
  //     'ContentType': 'application/x-www-form-urlencoded',
  //     'Authorization': localStorage.getItem("AUTH_TOKEN"),
  //     'UserId': this.getUserId() + '',
  //   });

  //   if (header) {
  //     headers = header;
  //   }

  //   return this.http.post(environment.SERVER_BASE_URL + path, formData, { headers: headers });
  // }
  public filePostBySecure(path: string, formData: FormData, header?: HttpHeaders, responseType: 'json' | 'text' = 'json'): Observable<any> {

    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem("AUTH_TOKEN"),
      'UserId': this.getUserId() + '',
    });

    if (header) {
      headers = header;
    }

    const request: any = {
      reportProgress: true,
      observe: 'events' as const,
      headers: headers,
      responseType: responseType,
    };


    return this.http.post(environment.SERVER_BASE_URL + path, formData, request);
  }

  public fileDownload(path: string, payload: any, header?: HttpHeaders): Observable<Blob> {

    let headers = new HttpHeaders({
      'Authorization': localStorage.getItem("AUTH_TOKEN"),
      'UserId': this.getUserId() + '',
      responseType: 'arraybuffer',
      // responseType: 'blob',
      observe: 'response'
    });

    if (header) {
      headers = header;
    }

    return this.http.post(environment.SERVER_BASE_URL + path, payload, { headers: headers, responseType: 'blob' });
  }


}
