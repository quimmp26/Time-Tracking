import {EventEmitter, Injectable} from '@angular/core';
import {Tag} from './tag.model';
import {AuthService} from './auth.service';
import {ServerService} from './server.service';
import {Response} from '@angular/http';

@Injectable()
export class TagService {
  public newTagEvent = new EventEmitter<string>();
  public tags: Tag[] = [];

  static checkIfTagValid(tagName) {
    if (tagName === '' || tagName === null) {
      return {isValid: false, error: 'Tag name can\'t be empty.'};
    }else {
      return {isValid: true, error: ''};
    }
  }

  constructor(private authService: AuthService, private serverService: ServerService) {
    if (authService.isAuthed()) {
      this.syncTagsWithServer();
    }

    this.authService.authEvent.subscribe((type) => {
      if (type === 'signout') {
        this.tags.splice(0, this.tags.length);
      } else {
        this.syncTagsWithServer();
      }
    });

  }

  getTags() {
    return this.tags;
  }

  syncTagsWithServer() {
    this.serverService
      .postData({'action': 'getTags', 'token': this.authService.getToken()})
      .subscribe((response: Response) => {
        const responseJson = response.json();

        if (responseJson.error === false) {
          let tag_index = 0;
          for (tag_index = 0; tag_index < responseJson.tags.length; tag_index++) {
            const tagData = responseJson.tags[tag_index];
            const tag = new Tag(tagData.name, tagData.totalTime, tagData.isCounting);
            tag.setTagService(this);
            this.tags.push(tag);
          }
        } else {
          alert(responseJson.message);
        }
      });
  }

  postStartCounting(name: string) {
    if (this.authService.isAuthed()) {
      return this.serverService.postData({
        'action': 'startCounting',
        'token': this.authService.getToken(),
        'name': name
      });
    } else {
      return false;
    }
  }

  postStopCounting(name: string) {
    if (this.authService.isAuthed()) {
      return this.serverService.postData({
        'action': 'stopCounting',
        'token': this.authService.getToken(),
        'name': name
      });
    } else {
      return false;
    }
  }

  getHistory(name: string) {
    if (this.authService.isAuthed()) {
      return this.serverService.postData({
        'action': 'getHistory',
        'token': this.authService.getToken(),
        'name': name
      });
    } else {
      return false;
    }
  }
}
