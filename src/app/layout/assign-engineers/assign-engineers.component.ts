import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { HttpLayerService } from 'src/app/services/http-service-layer.service';
import { Config } from '../../config/config';
import { ActivatedRoute } from '@angular/router';

//full calendar

import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-engineers',
  templateUrl: './assign-engineers.component.html',
  styleUrls: ['./assign-engineers.component.scss']
})
export class AssignEngineersComponent implements OnInit {

  @Output() engineersListUpdate = new EventEmitter();
  @Input('ticketId') ticketId;
  @Input('startDate') expectedStartDate;
  @Input('endDate') expectedEndDate;

  public emailIds: any = [];
  public tableOptions: any;
  public todayDate = new Date();
  public dateRangeToService = {
    startDate: null,
    expectedEndDate: null
  };
  public newEmail: any = '';
  public editDate = false;
  public actualStartDate;
  public actualEndDate;
  public message;
  public engineersList = [];
  public selectedEngineers = [];
  public viewCalendar = false;
  public options: OptionsInput;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;

  constructor(
    private _http: HttpLayerService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.options = {
      editable: true,
      events: [],
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      plugins: [dayGridPlugin, interactionPlugin]
    };
    this.tableOptions = {
      pageLength: 10,
    };
    this.fetchHistory();
    this.actualStartDate = this.expectedStartDate;
    this.actualEndDate = this.expectedEndDate;
    this.fetchEngineersList();
  }
  updateEmails() {
    const emails = JSON.parse(JSON.stringify(this.emailIds));
    for (let i = 0; i < this.selectedEngineers.length; i++) {
      if (this.selectedEngineers[i]['email']) {
        emails.push({email: this.selectedEngineers[i]['email']});
      }
    }
    this.engineersListUpdate.emit({ engineersList: this.selectedEngineers, emails: emails });
  }
  addEmailId() {
    this.emailIds.push({email: this.newEmail});
    this.newEmail = '';
    this.updateEmails();
  }
  editEmail(email, idx) {
    this.newEmail = JSON.parse(JSON.stringify(email['email']));
    this.emailIds.splice(idx, 1);
  }
  deleteEmailId(email, idx, event) {
    event.preventDefault();
    this.emailIds.splice(idx, 1);
    this.updateEmails();
  }
  fetchEngineersList() {
    let postJson = {
      ticketId: this.ticketId.ticketId,
      actualStartDate: this.actualStartDate,
      actualEndDate: this.actualEndDate
    };
    this._http.post(Config.SERVICE_IDENTIFIER.GET_ENGINEERS_LIST, postJson).subscribe((response) => {
      if (response.status === true) {
        this.engineersList = response.data;
        this.selectedEngineers = [];
        this.engineersListUpdate.emit({ engineersList: this.selectedEngineers });
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchHistory() {
    this._http.post(Config.SERVICE_IDENTIFIER.GET_VISIT_HISTORY, null).subscribe((response) => {
      if (response.status === true) {
        this.options.events = response.data;
      } else {
        this.toastr.error('', response.message);
      }
    });
  }
  fetchNewEngineers() {
    this.fetchEngineersList();
  }
  editModeOff() {
    this.editDate = false;
    this.fetchEngineersList();
  }
  editModeOn() {
    this.editDate = true;
  }


  updatEngineersList(engineer) {
    if (this.selectedEngineers.includes(engineer)) {
      this.selectedEngineers.splice(this.selectedEngineers.indexOf(engineer), 1);
    } else {
      this.selectedEngineers.push(engineer);
    }
    const emails = JSON.parse(JSON.stringify(this.emailIds));
    for (let i = 0; i < this.selectedEngineers.length; i++) {
      if (this.selectedEngineers[i]['email']) {
        emails.push({email: this.selectedEngineers[i]['email']});
      }
    }
    this.engineersListUpdate.emit({ engineersList: this.selectedEngineers, emails: emails });
  }
  checkEnineersList(engineer) {
    if (this.selectedEngineers.includes(engineer)) {
      return true;
    }
  }
  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return false;
    } else if (email !== '') {
      return true;
    }
  }
}
