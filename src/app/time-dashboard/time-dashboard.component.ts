import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {TagService} from '../tag.service';
import {ServerService} from '../server.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-time-dashboard',
  templateUrl: './time-dashboard.component.html',
  styleUrls: ['./time-dashboard.component.css'],
})
export class TimeDashboardComponent implements OnInit {

  constructor(private tagService: TagService, private serverService: ServerService, private authService: AuthService) { }

  ngOnInit() {
  }

  onAddTagSubmit(form: NgForm) {
    const formValue = form.value;
    const newTag = formValue.tagName;

    const tagCheck = TagService.checkIfTagValid(newTag);
    if (tagCheck.isValid === true) {
      this.serverService.postData({'action': 'submitTag', 'token': this.authService.getToken(), 'name': newTag})
        .subscribe(
          (response) => {
            console.log(response);
            const responseJson = response.json();
            if (responseJson.error === true) {
              alert(responseJson.message);
            } else {
              this.tagService.newTagEvent.emit(newTag);
              form.reset();
            }
          }
        );

    }else {
      alert(tagCheck.error);
    }
  }
}
