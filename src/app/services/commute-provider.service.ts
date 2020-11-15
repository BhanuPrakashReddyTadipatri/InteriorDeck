import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class CommuteProviderService {

  private subject = new Subject<any>();
  private menuSubject = new Subject<any>();
  private breadcrumbSubject = new Subject<any>();
  private toasterSubject = new Subject<any>();
  private progressSubject = new Subject<any>();
  private profilePicSubject = new Subject<any>();

  private loaderSubject = new Subject<any>();

  // for sending the message from <A> to <service>
  sendMessage(message: boolean) {
    this.subject.next({ flag: message });
  }

  // for clearing the message in <service>
  clearMessage() {
    this.subject.next();
  }

  // for receiving the message from <service> to <B>
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  changeMenuItem(item: string) {
    this.menuSubject.next({ menu: item });
  }
  updateMenuItem(): Observable<any> {
    return this.menuSubject.asObservable();
  }

  // PUBLISH BREADCRUMB
  sendBreadcrumbToComponent(breadcrumb) {
    this.breadcrumbSubject.next({ breadcrumb: breadcrumb });
  }

  // LISTEN BREADCRUMB CHANGE
  listenForBreadcrumbChange(): Observable<any> {
    return this.breadcrumbSubject.asObservable();
  }

  // PUBLISH TOASTER
  sendToasterMessage(toaster) {
    this.toasterSubject.next({ toaster: toaster });
  }

  // LISTEN TOATER CHANGE
  listenForToasterChange(): Observable<any> {
    return this.toasterSubject.asObservable();
  }

  // PUBLISH STEPS
  updateSteps(steps) {
    this.progressSubject.next({ steps: steps });
  }

  // LISTEN STEPS CHANGE
  listenStepsChange(): Observable<any> {
    return this.progressSubject.asObservable();
  }

  // LOADER FUNCTIONS
  show() {
    this.loaderSubject.next({ show: true });
  }
  hide() {
    this.loaderSubject.next({ show: false });
  }
  listenLoaderChange(): Observable<any> {
    return this.loaderSubject.asObservable();
  }

  // PUBLISH PROFILE PICTURE
  updateProfilePicture(status) {
    this.profilePicSubject.next({ update: status });
  }
  // OBSERVE FOR PROFILE PICTURE CHANGE
  observeProfilePictureChange(): Observable<any> {
    return this.profilePicSubject.asObservable();
  }
}
