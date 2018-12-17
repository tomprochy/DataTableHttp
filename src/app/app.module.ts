import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule,MatPaginatorModule,MatFormFieldModule,MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { TableOverviewExample } from './components/tableStack/table-overview-example';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    TableOverviewExample,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
