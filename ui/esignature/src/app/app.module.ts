import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { XhrInterceptor } from './XhrInterceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DateConvertService } from './service/date-convert.service';
import { DevToolsService } from './service/dev-tools.service';
import { AuthGuard } from './shared';
import { SharedModule } from './softcafe/shared/shared.module';
import { UserUnlockComponent } from './user-unlock/user-unlock.component';


// AoT requires an exported function for factories
export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  declarations: [
    AppComponent,
    UserUnlockComponent,
    // InstitutionAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
        }
    }),
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()

  ],
  providers: [AuthGuard, { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }, DatePipe, DateConvertService, DevToolsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
