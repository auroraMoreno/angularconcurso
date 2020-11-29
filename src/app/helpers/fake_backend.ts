import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import {User} from './../models/user';

const users: User[] = [{username:'S2VTournament',password:'sogetispain'}]

@Injectable()
export class FakeBackend implements HttpInterceptor{
    intercept(request:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
        const {url, method, headers, body} = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());
        
        function handleRoute() {
            switch(true){
                case url.endsWith('/S2VAPI/authenticate') && method === 'POST':
                    return authenticate();
            }
        }

        function authenticate(){

        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

    }
}