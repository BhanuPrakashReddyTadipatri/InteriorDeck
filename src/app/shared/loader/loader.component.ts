import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoaderServiceService } from './loader-service.service';
import { LoaderState } from './loader-state';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public show = false;
  private subscription: Subscription;

  constructor(
    private loaderService: LoaderServiceService
  ) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
