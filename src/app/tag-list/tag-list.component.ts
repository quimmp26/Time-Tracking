import { Component, OnInit } from '@angular/core';
import {Tag} from '../tag.model';
import {TagService} from '../tag.service';
import {ServerService} from '../server.service';


@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent {
  tags: Tag[];

  constructor(private tagService: TagService) {
    this.tagService.newTagEvent.subscribe(
      (newTag: string) => {
        const tag = new Tag(newTag, 0, false);
        tag.setTagService(this.tagService);
        this.tags.push(tag);
      }
    );

    this.tags = this.tagService.getTags();
  }

  onStartCounting(tag: Tag) {
    tag.startCountingWithPost();
  }
  onStopCounting(tag: Tag) {
    tag.stopCounting();
  }

  onShowHistory(tag: Tag) {
    tag.loadHistory( (response) => {
      tag.showHistory();
    });
  }

  onHideHistory(tag: Tag) {
    console.log(tag);
    tag.hideHistory();
  }
}
