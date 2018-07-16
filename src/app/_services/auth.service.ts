import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { map, delay, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  constructor(private http: Http) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).pipe(map((response: Response) => {
      const user = response.json();
      if (user) {
        localStorage.setItem('token', user.tokenString);
        this.userToken = user.tokenString;
      }
    }), catchError(this.handleError));
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model,  this.requestOptions()).pipe(catchError(this.handleError));
  }

  private requestOptions() {
    const headers = new Headers({ 'Content-type': 'application/json'});
    return new RequestOptions({ headers: headers});
  }

  private handleError(err: any) {
    const applicationError = err.headers.get('Application-Error');
    console.log(applicationError);
    if (applicationError) {
      return throwError(applicationError);
    }
    const serverError = err.json();
    let modelStateErrors = '';
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }
    console.log(serverError);
    return throwError(
      modelStateErrors || 'Server error'
    );
  }

}


