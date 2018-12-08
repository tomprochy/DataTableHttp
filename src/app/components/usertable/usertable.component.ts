import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import {DataSource} from '@angular/cdk/collections';
import { User } from '../../models/user.model';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {
  interval: any;
  errorMessage: string;
  Users: User[] = []
  dataSource = new MatTableDataSource(this.Users);
  displayedColumns = ['name', 'email', 'phone', 'company'];
  constructor(private userService: UserService) {
    console.log("inCtr");
   }
  
  ngOnInit() {
      console.log('on init function');
      this.refreshData();
          this.interval = setInterval(() => { 
              this.refreshData(); 
          }, 5000);
    }
  //   ngOnInit() {
  //     this.refreshData();
  //     this.interval = setInterval(() => { 
  //         this.refreshData(); 
  //     }, 5000);
  // }
  
  refreshData(): void{
    this.userService.getUser().subscribe(
      Usersbb => {
      this.Users = Usersbb;
    },
      error => 
      {
      this.errorMessage = <any>error;
      console.log(this.errorMessage);
      
      }
    );
  }

}
// export class UserDataSource extends DataSource<any> {
//   constructor(private userService: UserService) {
//     super();
//     console.log("inCtr2");
//   }
//   connect(): Observable<User[]> {
//     return this.userService.getUser();
//   }
//   disconnect() {}
// }