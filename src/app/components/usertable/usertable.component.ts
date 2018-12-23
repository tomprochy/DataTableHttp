import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import {DataSource} from '@angular/cdk/collections';
import { User } from '../../models/user.model';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource,MatPaginator,MatSort } from '@angular/material';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {
  interval: any;
  errorMessage: string;
  Users: User[] = []
  dataSource: MatTableDataSource<User>;
  
  displayedColumns = ['ID', 'Locality', 'PhoneNumber', 'MAC'];
  num: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private userService: UserService) {
    console.log("inCtr");
   }
  
  ngOnInit() {
      console.log('on init function');
      this.refreshData();
          this.interval = setInterval(() => { 
              this.refreshData(); 
          }, 500000);
          
    }
  //   ngOnInit() {
  //     this.refreshData();
  //     this.interval = setInterval(() => { 
  //         this.refreshData(); 
  //     }, 5000);
  // }
  
  refreshData(): void{
    let a = this.userService.getUser().subscribe(
      Usersbb => {
      this.Users = Usersbb;
      console.log("nactenaData poradi: "+ this.num);
      // Varianta s printem dat.
      //console.log("nactenaData poradi: "+ this.num + JSON.stringify(Usersbb));
      this.num++;
    },
      error => 
      {
      this.errorMessage = <any>error;
      console.log(this.errorMessage);
      },
      () =>
      {
        this.dataSource = new MatTableDataSource(this.Users);
        this.dataSource.paginator = this.paginator;
        console.log("subscribe hotovo")
      }
    );
  }
// zde jsem skončil, je tam CORS problém - nastavil jsem data source do BM
  ngAfterViewInit() {

   // this.dataSource.sort = this.sort;
  }

}