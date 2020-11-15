import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { throwError } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

import { Config } from '../config/config';
import { SessionService } from './session.service';
import { LoaderServiceService } from '../shared/loader/loader-service.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpLayerService {
  private monitoring = {
    pendingRequestsNumber: 0
  };

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _session_service: SessionService,
    private loaderService: LoaderServiceService
  ) { }

  get(url: string, options?: any): Observable<any> {
    try {
      this.showLoader();
      this.monitoring.pendingRequestsNumber++;
      return this.handleResponse(this._http.get(url)).finally(() => {
        this.monitoring.pendingRequestsNumber--;
        this.onEnd();
      });
    } catch (error) {
      // this.showServiceNotFoundMessage();
      console.log(error);
    }
  }

  post(url: string, data: any, options?: any): Observable<any> {
    try {
      this.showLoader();
      const headerJson = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Identifier': this._session_service.api.local.get(Config.USER_IDENTIFIER),
        'User-Category': this._session_service.api.local.get(Config.USER_ROLE)
      };
      const headersConfig = new HttpHeaders(headerJson);
      const requestOptions = { headers: headersConfig };
      this.monitoring.pendingRequestsNumber++;
      const body = JSON.stringify(data);
      return this.handleResponse(this._http.post(url, body, requestOptions)).finally(() => {
        this.monitoring.pendingRequestsNumber--;
        this.onEnd();
      });
    } catch (error) {
      console.log(error);
      console.log('error');
    }
  }

  postWithoutSpinner(url: string, data: any, options?: any): Observable<any> {
    try {
      const headerJson = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Identifier': this._session_service.api.local.get(Config.USER_IDENTIFIER),
        'User-Category': this._session_service.api.local.get(Config.USER_ROLE)
      };
      const headersConfig = new HttpHeaders(headerJson);
      const requestOptions = { headers: headersConfig };
      this.monitoring.pendingRequestsNumber++;
      const body = JSON.stringify(data);
      return this.handleResponse(this._http.post(url, body, requestOptions)).finally(() => {
        this.monitoring.pendingRequestsNumber--;
      });
    } catch (error) {
      console.log(error);
    }
  }

  postFormData(url: string, data: any, options?: any): Observable<Response> {
    try {
      this.showLoader();
      const httpHeaders = new HttpHeaders();
      httpHeaders.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      httpHeaders.set('User-Identifier', this._session_service.api.local.get(Config.USER_IDENTIFIER));
      // tslint:disable-next-line:no-shadowed-variable
      const options = { headers: httpHeaders };
      this.monitoring.pendingRequestsNumber++;
      const body = JSON.stringify(data);
      return this.handleResponse(this._http.post(url, body, options)).finally(() => {
        this.monitoring.pendingRequestsNumber--;
        this.onEnd();
      });
    } catch (error) {
      console.log(error);
    }
  }

  postText(url: string, data: any, options?: any): Observable<Response> {
    try {
      this.showLoader();

      const headerJson: any = {
        'Content-Type': 'text/plain',
        // token: localStorage.token,
        // 'User-Identifier': this._session_service.api.local.get(Config.USER_IDENTIFIER),

      };
      if (this._session_service.api.local.get('ssoLogin')) {
        headerJson.token = localStorage.token;
      }
      // const httpHeaders = new HttpHeaders(headerJson);


      // const httpHeaders = new HttpHeaders();
      // httpHeaders.set('Content-Type', 'text/plain').set('token', localStorage.token);
      // httpHeaders.set('User-Identifier', this._session_service.api.local.get(Config.USER_IDENTIFIER));
      // tslint:disable-next-line:no-shadowed-variable
      const options = { headers: new HttpHeaders(headerJson) };
      this.monitoring.pendingRequestsNumber++;
      const body = JSON.stringify(data);
      return this.handleResponse(this._http.post(url, body, options)).finally(() => {
        this.monitoring.pendingRequestsNumber--;
        this.onEnd();
      });
    } catch (error) {
      console.log(error);
    }
  }

  postForm(url: string, data: any, options?: any): Observable<Response> {
    try {
      this.showLoader();
      const headerJson = {
        'User-Identifier': this._session_service.api.local.get(Config.USER_IDENTIFIER),
        'User-Category': this._session_service.api.local.get(Config.USER_ROLE)
      };
      const headersConfig = new HttpHeaders(headerJson);
      const requestOptions = { headers: headersConfig };
      this.monitoring.pendingRequestsNumber++;
      const body = data;
      return this.handleResponse(this._http.post(url, body, requestOptions)).finally(() => {
        this.monitoring.pendingRequestsNumber--;
        this.onEnd();
      });
    } catch (error) {
      console.log(error);
    }
  }

  form_post(url: string, data: any, options?: any): Observable<Response> {
    this.monitoring.pendingRequestsNumber++;
    return this.handleResponse(this._http.post(url, data)).finally(() => {
      this.monitoring.pendingRequestsNumber--;
    });
  }

  form_data(url: string, data: any, options?: any): Observable<Response> {
    this.monitoring.pendingRequestsNumber++;
    const formData = new FormData();
    // tslint:disable-next-line:forin
    for (const k in data) {
      formData.append(k, data[k]);
    }
    return this.handleResponse(this._http.post(url, formData, this.getRequestOptionArgs(options, false))).finally(() => {
      this.monitoring.pendingRequestsNumber--;
    });
  }

  put(url: string, data: any, options?: any): Observable<Response> {
    this.monitoring.pendingRequestsNumber++;
    const body = JSON.stringify(data);
    return this.handleResponse(this._http.put(url, body, this.getRequestOptionArgs(options))).finally(() => {
      this.monitoring.pendingRequestsNumber--;
    });
  }

  delete(url: string, options?: any): Observable<Response> {
    this.monitoring.pendingRequestsNumber++;
    return this.handleResponse(this._http.delete(url, options)).finally(() => {
      this.monitoring.pendingRequestsNumber--;
    });
  }

  getRequestOptionArgs(options?: any, useContentType: boolean = true): any {
    if (options == null) {
      options = new Object();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    options.headers = this.getHeaders();
    return options;
  }

  getHeaders() {
    const httpHeaders = new HttpHeaders();
    httpHeaders.set('token', this._session_service.api.local.get(Config.USER_IDENTIFIER));
    httpHeaders.set('User-Identifier', this._session_service.api.local.get(Config.USER_IDENTIFIER));
    return httpHeaders;
  }

  handleResponse(observable: Observable<any>, isBackgroundServiceCall: boolean = false): Observable<any> {
    return observable.catch((err, source) => {
      if (err.status === 401 && !err.url.endsWith('api/account/login')) {
        this._session_service.api.session.remove(Config.SESSION_STATUS);
        this._session_service.api.session.remove(Config.USER_IDENTIFIER);
        this._router.navigate(['/images']);
        return Observable.empty();
      } else {
        if (!isBackgroundServiceCall && Config.IS_DEV) {
          this.showServiceNotFoundMessage(err);
        }
        return Observable.throw(err);
      }
    }).finally(() => {
      if (this.monitoring.pendingRequestsNumber === 0) {
        this.hideLoader();
      }
    });
  }



  public handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    if (this.monitoring.pendingRequestsNumber === 0) {
      this.loaderService.hide();
    }
  }

  private publishBreadcrumb(breadcrumb): void {
    const unknownLocation = [
      {
        heading: 'Unknown Location',
        parentRoute: 'landing',
        route: 'landing',
        active: true,
        icon: 'fa fa-times'
      }
    ];
    breadcrumb = breadcrumb ? breadcrumb : unknownLocation;
  }

  private showServiceNotFoundMessage(callback) {
    // this._commute.sendToasterMessage({
    //   header: (callback.status === 404) ? '404: NOT FOUND' : 'INTERNAL SERVER ERROR',
    //   body: (callback.status === 404) ? 'Requested URL/Endpoint does not exist' : 'Please try again later',
    //   status: 'error'
    // });
  }

  public hideLoaderFromS3() {
    this.hideLoader();
  }

  public showLoaderFromS3() {
    this.showLoader();
  }

  public increasePendingRequest() {
    this.monitoring.pendingRequestsNumber++;
  }

  public decreasePendingRequest() {
    this.monitoring.pendingRequestsNumber--;
  }

  public downloadExcel(tableData, title?) {
    // tslint:disable-next-line:variable-name
    let tab_text = '<table border=\'2px\'><tr bgcolor=\'#87AFC6\'>';
    for (const head of tableData.headerContent) {
      tab_text += '<th>' + head.label + '</th>';
    }
    tab_text += '</tr>';

    for (const body of tableData.bodyContent) {
      tab_text += '<tr>';
      for (const head of tableData.headerContent) {
        tab_text += '<td>' + body[head.key] + '</td>';
      }
      tab_text += '</tr>';
    }

    tab_text = tab_text + '</table>';

    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { } else {                 // other browser not tested on IE 11
      const link = document.createElement('a');
      link.download = (title || 'export') + '.xls';
      link.href = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
      link.click();
    }

    return;
  }

  getDateTimeForExport() {
    const d = new Date();
    const dformat = [
      d.getDate(),
      d.getMonth() + 1,
      d.getFullYear()].join('-') + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }
  formatDate(date, dateFirst?) {
    const temp = new Date(date);
    let month = '' + (temp.getMonth() + 1);
    let day = '' + temp.getDate();
    const year = temp.getFullYear();
    month = month.length < 2 ? '0' + month : month;
    day = day.length < 2 ? '0' + day : day;
    return [dateFirst ? day : year, month, dateFirst ? year : day].join('-');
  }

  formatTime(time) {
    const temp = new Date(time);
    let hours = '' + temp.getHours();
    let minutes = '' + temp.getMinutes();
    let seconds = '' + temp.getSeconds();
    hours = hours.length < 2 ? '0' + hours : hours;
    minutes = minutes.length < 2 ? '0' + minutes : minutes;
    seconds = seconds.length < 2 ? '0' + seconds : seconds;
    return [hours, minutes, seconds].join(':');
  }

}
