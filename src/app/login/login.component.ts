import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { HttpLayerService } from '../services/http-service-layer.service';
import { Config } from '../config/config';
import { environment } from 'src/environments/environment';
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public credentials: any = {};
  public message;
  public ssoLogin = true;
  public klDomains = environment.kl_domains;
  private clientId = environment.google_client_id;
  private scope = [
    'profile',
    'email',
  ].join(' ');
  public auth2: any;
  constructor(
    public router: Router,
    private _session: SessionService,
    private _http: HttpLayerService
  ) { }

  ngOnInit() {
    // this.checkSession();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    const userAccessed = JSON.parse(localStorage.getItem(Config.CONSTANTS.SESSION_KEY));
    if (this.ssoLogin) {
      if (userAccessed !== undefined && userAccessed != null && userAccessed.email) {
        const jsonData = {
          email: userAccessed.email
        };
        this.router.navigate(['/home']);
      } else {
        setTimeout(() => {
          this.googleInit();
        }, 200);
      }
    }
  }


  checkSession() {
    if (this._session.api.local.get(Config.SESSION_STATUS)) {
      this.router.navigate(['/home']);
    }
  }

  loginAccess(event) {
    try {
      const data = window.btoa(JSON.stringify(this.credentials));
      this._session.api.local.save('ssoLogin', false);
      this.ssoLogin = this._session.api.local.get('ssoLogin');
      this._http.postText(Config.SERVICE_IDENTIFIER.LOGIN, data).subscribe(
        responseJson => {
          try {
            if (responseJson.status) {
              this._session.api.local.save(Config.SESSION_STATUS, 'true');
              this._session.api.local.save(Config.USER_IDENTIFIER, responseJson['data']['userID']);
              this._session.api.local.save(Config.USER_ROLE, responseJson['data']['userRole']);
              this.router.navigate(['/home']);
            } else {
              this.message = responseJson['message'];
            }
          } catch (error) {
            console.log(error);
          }
        }, error => { });
    } catch (error) {
      console.log(error);
    }
  }
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: this.scope,
      });
      gapi.signin2.render('googleBtn', {
        scope: this.scope,
        width: 160,
        height: 50,
        theme: 'dark',
        onsuccess: param => this.onSignIn(param),
      });
    });
  }
  public onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    const domain = profile.getEmail().split('@')[1];
    const tokenId = googleUser.getAuthResponse().id_token;
    const googleResp = googleUser.getAuthResponse();
    const d1 = new Date();
    const d2 = new Date(d1);
    d2.setMinutes(d1.getMinutes() + 50);
    if (this.klDomains.indexOf(domain) > -1) {
      const userDetails = {
        name: profile.getName(),
        email: profile.getEmail(),
        photo: profile.getImageUrl(),
        // tslint:disable-next-line: object-shorthand-properties-first
        tokenId,
        // tslint:disable-next-line: object-shorthand-properties-first
        googleResp,
        expireTimestamp: d2.getTime(),
      };
      document.cookie = 'username=' + profile.getName() + ',email=' + profile.getEmail() + ',tokenId=' + tokenId + ';';
      localStorage.setItem(Config.CONSTANTS.SESSION_KEY, JSON.stringify(userDetails));
      const postJson = {
        email: profile.getEmail(),
        // token: tokenId,
      };
      localStorage.token = tokenId;
      this.loginSSO(postJson, true);
    } else {
      // this.http.sessionExpired();
    }
  }

  loginSSO(event, reload?) {
    try {
      if (!localStorage.token) {
        return;
      }
      const data = window.btoa(JSON.stringify(event));
      this._session.api.local.save('ssoLogin', true);
      this.ssoLogin = this._session.api.local.get('ssoLogin');
      this._http.postText(Config.SERVICE_IDENTIFIER.SSO_LOGIN, data).subscribe(
        responseJson => {
          try {
            if (responseJson.status) {
              this._session.api.local.save(Config.SESSION_STATUS, 'true');
              this._session.api.local.save(Config.USER_IDENTIFIER, responseJson['data']['userID']);
              this._session.api.local.save(Config.USER_ROLE, responseJson['data']['userRole']);
              // this.router.navigate(['/home']);
              if (reload) {
                window.location.reload();
              }
            } else {
              this.message = responseJson['message'];
            }
          } catch (error) {
            console.log(error);
          }
        }, error => { });
    } catch (error) {
      console.log(error);
    }
  }

  checkSessionTimedOut(expireAt) {
    try {
      const now = new Date();
      const expTime = new Date(expireAt);
      if (now > expTime) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
