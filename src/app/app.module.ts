import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule,MatPaginatorModule,MatFormFieldModule,MatInputModule, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { TableOverviewExample } from './components/tableStack/table-overview-example';
import { UserService } from './services/user.service';
import { ApListComponent } from './components/ap/ap-list/ap-list.component';
import { RpListComponent } from './components/rp/rp-list/rp-list.component';
import { WelcomeComponent } from './components/welcome/welcome/welcome.component';


@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    TableOverviewExample,
    ApListComponent,
    RpListComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    RouterModule.forRoot([
      {path: 'users', component:UsertableComponent},
      {path: 'aps', component:AppComponent},
      {path: 'rps', component:RpListComponent},
      { path: 'welcome', component: WelcomeComponent },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ])
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
