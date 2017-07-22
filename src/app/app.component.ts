import {Component, OnInit} from '@angular/core';
import {TagService} from './tag.service';
import {ServerService} from './server.service';
import {AuthService} from './auth.service';
import {CookieService} from 'ng2-cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TagService, ServerService, AuthService, CookieService]
})
export class AppComponent implements OnInit {

  constructor (private cookieService: CookieService, private authService: AuthService) {
    const token = this.cookieService.get('token');

    if (token !== null && token !== '') {
      this.authService.authWithToken(token);
    }
  }

  ngOnInit(): void {
  }
}
