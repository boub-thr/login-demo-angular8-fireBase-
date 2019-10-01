import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppwelcomeComponent } from './appwelcome/appwelcome.component';
import { AuthComponent } from './auth/auth.component';
import { MaterialModule } from './app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SingUpComponent } from './auth/sing-up/sing-up.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInerceptorService } from './services/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    AppwelcomeComponent,
    AuthComponent,
    SingUpComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass: AuthInerceptorService, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
