import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private _session: SessionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    if (this._session.api.local.get(Config.SESSION_STATUS) && this._session.api.local.get(Config.USER_IDENTIFIER)) {
      if (this.checkUserRole(route.data.role)){
        return true;
      }
      else{
        this.router.navigate(['/not-found']);
        return false;
      }
    }
    this._session.api.local.clear();
    this._session.api.session.clear();
    this.router.navigate(['/login']);
    return false;
  }
  checkUserRole(role) {
    if (role.includes( this._session.api.local.get(Config.USER_ROLE))) {
      return true;
    }
  }
}
