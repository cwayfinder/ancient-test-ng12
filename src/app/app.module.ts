import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TopBarModule } from './top-bar/top-bar.module';
import { StoreModule } from '@ngrx/store';
import { effects, reducers } from './_state';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { CustomSerializer } from './_state/router/custom-serializer';
import { DecoratorsService } from './_decorators/decorators.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    TopBarModule,
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private decorators: DecoratorsService) {
    this.decorators.init();
  }
}
