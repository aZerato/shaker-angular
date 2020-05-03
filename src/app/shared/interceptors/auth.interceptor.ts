import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/users/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor 
{
    constructor(private _authService: AuthenticationService) {}

    intercept(request: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

            if (!request.headers.has('Content-Type')) {
                request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
            }

        return this._authService
            .getHeaderAutorizationValue()
            .pipe<HttpEvent<any>>(
                mergeMap((bearerVal: string) => 
                {
                    if (bearerVal) 
                    {
                        const cloned = request.clone({
                            headers: request.headers.set("Authorization",
                                "Bearer " + bearerVal)
                        });
            
                        return next.handle(cloned);
                    }
                    
                    return next.handle(request);
                }));

        
    }
}