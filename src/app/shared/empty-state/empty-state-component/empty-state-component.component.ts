import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EmptyStateDataConf } from '../empty-state-interface';

@Component({
  selector: 'app-empty-state-component',
  templateUrl: './empty-state-component.component.html',
  styleUrls: ['./empty-state-component.component.scss']
})
export class EmptyStateComponentComponent implements OnInit {
  @Input() emptyData: EmptyStateDataConf; // get input data from parent component
  @Output() actionEmitter: EventEmitter<any>; // Emit to Parent Component

  constructor() {
    this.actionEmitter = new EventEmitter<any>();
  }

  ngOnInit() {
  }

  /**
   * Action event emitted to parent
   * @param e button related data
   */
  eventActionEmitter(e) {
    this.actionEmitter.emit(e);
  }

}
