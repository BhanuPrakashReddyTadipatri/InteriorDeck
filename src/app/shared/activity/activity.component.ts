import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'kl-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {

  @Input() activityData;
  @Output() performEmitterAction = new EventEmitter();

  public activityFormatted = [];

  constructor() { }

  ngOnInit() {
    this.formatActivity();
  }
  goBackToForm() {
    try {
      const data = {
        action: 'cancel',
      };
      this.performEmitterAction.emit(data);
    } catch (error) {
      console.log(error);
    }
  }

  formatActivity() {
    try {
      if (!this.activityData || this.activityData.length <= 0) {
        this.activityFormatted = [];
        return;
      }
      this.activityData.sort((a, b) => {
        const aa: any = new Date(a.changedTimeStamp);
        const bb: any = new Date(b.changedTimeStamp);
        return bb - aa;
      });
      const dates = [];
      for (const item of this.activityData) {
        if (item.changedDate) {
          if (dates.indexOf(item.changedDate) <= -1) {
            dates.push(item.changedDate);
          }
        }
      }
      for (const dateItem of dates) {
        const obj = {
          date: dateItem,
          dateFormated: this.getDateShotFromat(dateItem),
          activities: [],
        };
        for (const item of this.activityData) {
          if (item.changedDate && item.changedDate === dateItem) {
            item.activityLog = item.activityLog.split('\n').join('<br/>');
            obj.activities.push(item);
          }
        }
        this.activityFormatted.push(obj);
      }
    } catch (error) {
      console.log(error);
    }
  }

  getDateShotFromat(dateVal) {
    try {
      if (!dateVal) { return ''; }
      const newDate = new Date(dateVal);
      const dateArray = newDate.toDateString().split(' ');
      return `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;
    } catch (error) {
      console.log(error);
      return dateVal;
    }
  }
}
