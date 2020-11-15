import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from '../../config/config';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {
  public feedbackinfo;
  public feedbackFilter = '';
  public searchKeys: any = ['siteName', 'ticketId', 'userID', 'categoryList', 'uploadtime'];
  public feedbackList;
  public show = false;
  public modalObj: any = {};

  constructor(
    private toastr: ToastrService,
    private _http: HttpLayerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFeedbacks();
  }

  getFeedbacks() {
    this._http.post(Config.SERVICE_IDENTIFIER.FETCH_FEEDBACK_LIST, {}).subscribe((response) => {
      if (response.status === true) {
        this.feedbackList = response.data['table']
      } else {
        this.toastr.error('Unable To Load Feedbacks');
      }
    });
  }
  buildArray(count) {
    let temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(i);
    }
    return temp;
  }
}
