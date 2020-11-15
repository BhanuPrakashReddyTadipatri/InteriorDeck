import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  private _getLocal(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  private _saveLocal(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  private _removeLocal(key) {
    return localStorage.removeItem(key);
  }
  private _clearLocal() {
    return localStorage.clear();
  }
  private _getSession(key) {
    let data: any;
    try {
      data = JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      data = sessionStorage.getItem(key);
    }
    return data;
  }
  private _saveSession(key, value) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }
  private _removeSession(key) {
    return sessionStorage.removeItem(key);
  }
  private _clearSession() {
    return sessionStorage.clear();
  }
  // tslint:disable-next-line:member-ordering
  public api = {
    local: {
      get: this._getLocal,
      save: this._saveLocal,
      remove: this._removeLocal,
      clear: this._clearLocal
    },
    session: {
      get: this._getSession,
      save: this._saveSession,
      remove: this._removeSession,
      clear: this._clearSession
    }
  };
}
