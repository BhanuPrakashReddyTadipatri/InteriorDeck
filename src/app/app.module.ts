import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthGuard } from './shared';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderServiceService } from './shared/loader/loader-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    NgbModule
  ],
  exports: [
    LoaderComponent
  ],
  providers: [
    AuthGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LoaderServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
