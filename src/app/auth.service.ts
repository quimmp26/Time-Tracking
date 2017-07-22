import {EventEmitter, Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {Observable} from 'rxjs/Observable';
import {Response} from '@angular/http';
import {CookieService} from 'ng2-cookies';

@Injectable()
export class AuthService {
  private authed = false;
  private token: string;
  public authEvent = new EventEmitter<string>();

  constructor(private serverService: ServerService, private cookieService: CookieService) {}

  auth(email: string, password: string, callback: Function) {
    const authRequest: Observable<Response> = this.serverService.postData({action: 'auth', email: email, password: password});

    authRequest.subscribe(
      (response: Response) => {
        const responseJson = response.json();

        if (responseJson.error === false) {
          this.authed = true;
          this.token = responseJson.token;
          this.authEvent.emit(responseJson.type);

          this.cookieService.set('token', this.token);
        }else {
          this.authed = false;
          this.token = null;
        }

        callback(response);
      }
    );
    return authRequest;
  }

  authWithToken(token: string) {
    const authRequest: Observable<Response> = this.serverService.postData({action: 'authWithToken', token: token});

    authRequest.subscribe(
      (response: Response) => {
        const responseJson = response.json();

        if (responseJson.error === false) {
          this.authed = true;
          this.token = responseJson.token;
          this.authEvent.emit(responseJson.type);

          this.cookieService.set('token', this.token);
        }else {
          this.authed = false;
          this.token = null;
        }
      }
    );
    return authRequest;
  }

  isAuthed () {
    return this.authed;
  }

  singOut() {
    this.authed = false;
    this.token = null;
    this.cookieService.delete('token');

    this.authEvent.emit('signout');
  }

  getToken() {
    return this.token;
  }
}
