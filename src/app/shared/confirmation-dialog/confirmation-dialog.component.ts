import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommuteProviderService } from '../../services/commute-provider.service'

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @ViewChild('confirmPopup') confirmPopup;

  @Output() actionPerformed: EventEmitter<any> = new EventEmitter<any>();
  @Input('confirmJson') confirmJson;

  public message;
  public title;
  public trueButton;
  public falseButton;
  messageContent: any;

  constructor(
    private modalService: NgbModal,
    private _commute: CommuteProviderService
  ) { }

  ngOnInit() {
    this.message = this.confirmJson.message;
    this.messageContent = this.confirmJson.messageContent;
    this.title = this.confirmJson.title;
    this.trueButton = this.confirmJson.trueButton;
    this.falseButton = this.confirmJson.falseButton;
  }
  ngAfterViewInit() {
    setTimeout(() => { this.openPopup(); });
  }

  openPopup() {
    this.modalService.open(this.confirmPopup).result.then((result) => {
      this.actionPerformed.emit({ flag: false,action: false });
    }, (reason) => {
      this.actionPerformed.emit({ flag: false,action: false  });
    });
  }

  okClicked() {
    this.actionPerformed.emit({ flag: false,action: true  });
  }
}
