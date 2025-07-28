import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { CommonService } from "./softcafe/common/common.service";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class XhrInterceptor implements HttpInterceptor {

    constructor(private cs: CommonService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        console.log(req);
        let xhr = req;
        if (req.url.includes('/public/')) {
            xhr = req.clone({
                withCredentials: true  //local false and live true
            });
            //console.log(xhr)
            // return next.handle(xhr);
        }
        else {
            if (!req.headers.get('Authorization')) {
                xhr = req.clone({
                    withCredentials: true,
                    setHeaders: {
                        // 'Content-Type' : 'application/x-www-form-urlencoded',
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': localStorage.getItem("AUTH_TOKEN"),
                        'UserId': this.cs.getUserId() + '',
                    },
                });
                // return next.handle(xhr);
            }else{
                xhr = req.clone({
                    withCredentials: true,
                    headers: req.headers,
                });
            }
        }

        return next.handle(xhr).pipe(
            catchError((error: any) =>{
                if( error.status === 403){
                    debugger
                    this.cs.removeSession();
                    this.router.navigate(['/login'], {queryParams:{sessionExpired: true}});
                }
                return throwError(error);
            })
        );

    }
}