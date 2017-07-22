import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Response} from '@angular/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('authModelClose') authModelCloseEl: ElementRef;
  public thereIsMessage = false;
  public message = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onAuthSubmit(form: NgForm) {
    // $("#authModal").remove();
    this.authService.auth(form.value.email, form.value.password, (response: Response) => {
      // response.error a göre bildiri yap
      const responseJson = response.json();
      if (responseJson.error === true) {
        this.thereIsMessage = true;
        this.message = responseJson.message;
      } else {
        this.authModelCloseEl.nativeElement.click();
        this.thereIsMessage = false;
      }
      // console.log('dsf', response.json());
    });
  }

  onSignOut() {
    this.authService.singOut();
  }

  isAuthed() {
    return this.authService.isAuthed();
  }
}
