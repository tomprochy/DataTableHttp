import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { User } from '../../models/user.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';

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
  positionFilter = new FormControl();
  nameFilter = new FormControl();
  globalFilter = '';

  filteredValues = {
    position: '', name: '', weight: '',
    symbol: ''
  };

  displayedColumns = ['ID', 'Locality', 'PhoneNumber', 'MAC'];
  num: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private userService: UserService) {
    console.log("inCtr");
  }

  ngOnInit() {
    console.log('on init function');
    this.refreshData();
    this.interval = setInterval(() => {
      this.refreshData();
    }, 500000);

    this.positionFilter.valueChanges.subscribe((positionFilterValue) => {
      this.filteredValues['position'] = positionFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
      this.filteredValues['name'] = nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();

  }
  //   ngOnInit() {
  //     this.refreshData();
  //     this.interval = setInterval(() => { 
  //         this.refreshData(); 
  //     }, 5000);
  // }

  refreshData(): void {
    let a = this.userService.getUser().subscribe(
      Usersbb => {
        this.Users = Usersbb;
        console.log("nactenaData poradi: " + this.num);
        // Varianta s printem dat.
        //console.log("nactenaData poradi: "+ this.num + JSON.stringify(Usersbb));
        this.num++;
      },
      error => {
        this.errorMessage = <any>error;
        console.log(this.errorMessage);
      },
      () => {
        this.dataSource = new MatTableDataSource(this.Users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log("subscribe hotovo")
      }
    );
  }
  // zde jsem skončil, je tam CORS problém - nastavil jsem data source do BM
  ngAfterViewInit() {


  }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }

  applyFilter(filter) {
    this.globalFilter = filter;
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: User, filter: string): boolean => {
      var globalMatch = !this.globalFilter;

      if (this.globalFilter) {
        // search all text fields
        globalMatch = data.name.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
      }

      if (!globalMatch) {
        return;
      }

      let searchString = JSON.parse(filter);
      return data.position.toString().trim().indexOf(searchString.position) !== -1 &&
        data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

}

// zde jsem skoncil a moc nerozumim provedeni extra filtru pro kazdy sloupec
// napoveda zde: https://stackblitz.com/edit/angular-hbakxo-5jeaic?file=app%2Ftable-filtering-example.ts