import {TagService} from './tag.service';
export class Tag {
  public history: any[];
  public name: string;
  public totalTime: number;
  public totalTimeHR: string;
  public isCounting: boolean;
  private countInterval: number;
  private tagService: TagService;
  public historyVisible;

  constructor(name: string, totalTime: number, isCounting: boolean) {
    this.name = name;
    this.totalTime = totalTime;
    this.isCounting = isCounting;
    this.totalTimeHR = this.formattedTotalTime();
    this.historyVisible = false;

    if (this.isCounting) {
      this.startCounting();
    }
  }

  setTagService(tagService: TagService) {
    this.tagService = tagService;
  }

  startCounting() {
    this.isCounting = true;
    this.countInterval = setInterval(() => {
      this.totalTime += 1;
      this.updateTotalTimeHR();
    }, 1000);
  }

  startCountingWithPost() {
    if (typeof this.tagService !== 'undefined') {
      const post = this.tagService.postStartCounting(this.name);
      if (post === false) {
        console.log('To save progress You must sign up/in.');
        this.startCounting()
      } else {
        post.subscribe(() => this.startCounting());
      }
    } else {
      console.log('No service attached to Tag, couldn\'t post start event.');
    }
  }

  stopCounting() {
    if (typeof this.tagService !== 'undefined') {
      const post = this.tagService.postStopCounting(this.name);
      if (post === false) {
        console.log('To save progress You must sign up/in.');
        this.isCounting = false;
        clearInterval(this.countInterval);
      } else {
        post.subscribe(() => {
          this.isCounting = false;
          clearInterval(this.countInterval);
        });
      }
    }
  }

  updateTotalTimeHR() {
    this.totalTimeHR = this.formattedTotalTime();
  }

  formattedTotalTime() {
    const hours = Math.floor(this.totalTime / 3600);
    const minutes = Math.floor((this.totalTime - (hours * 3600)) / 60);
    const seconds = this.totalTime - (hours * 3600) - (minutes * 60);

    let formatted = '';
    formatted += (hours < 10 ? '0' : '') + hours.toString() + ':';
    formatted += (minutes < 10 ? '0' : '') + minutes.toString() + ':';
    formatted += (seconds < 10 ? '0' : '') + seconds.toString();
    return formatted;
  }

  loadHistory(callback: Function) {
    const getHistory = this.tagService.getHistory(this.name);

    if (getHistory === false) {
      return false;
    } else {
      getHistory.subscribe(
        (response) => {
          const responseJSON = response.json();

          if (responseJSON.error === false) {
            this.history = responseJSON.history;
          }
          callback(response);
        }
      );
    }
  }

  showHistory() {
    this.historyVisible = true;
  }

  hideHistory() {
    this.historyVisible = false;
  }
}
