import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { User } from '../../models/user.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

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
  runOrder: number = 1;

  filteredValues = {
    Locality: '', PhoneNumber: '', MAC: ''
  };

  displayedColumns = ['ID', 'Locality', 'PhoneNumber', 'MAC'];
  num: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private userService: UserService) {
    console.log("inCtr");
    //this.dataSource = new MatTableDataSource(this.Users);
     console.log("V constructoru: " + JSON.stringify(this.Users));
  }

  ngOnInit() {
    console.log('on init function');
    this.refreshData();
 
    this.interval = setInterval(() => {
      this.refreshData();
    }, 20000);


    // zde se přijímá event změny v zahlavích sloupců
    this.positionFilter.valueChanges.subscribe((positionFilterValue) => {
      this.filteredValues['position'] = positionFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
      this.filteredValues['name'] = nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });

    // vlastní predikát pro filtr, ten základní stringifikuje řádek a hledá v něm string ve filtru a vrací true pokud jej najde jako substring
    

  }

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
        if (this.runOrder == 1)
        {
          console.log("bezim prvne");
        this.dataSource = new MatTableDataSource(this.Users);
        this.dataSource.filterPredicate = this.customFilterPredicate();
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }
        
     // zde jsem skončil, upravil jsem načítání matTable s tím, že ve subscribe-final větvi je jen při prvním běhu, pak již ne, zatím se zdá vše OK
      //  console.log("subscribe hotovo")
        this.runOrder++;
      }
    );
  }

  ngAfterViewInit() {

    
    
  }

  // applyFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
  //   this.dataSource.filter = filterValue;
  // }

  applyFilter(filter: string) {
   // console.log("spoustim filter se stringem: " + filter)
    this.globalFilter = filter;
    this.dataSource.filter = JSON.stringify(this.filteredValues);
  }

  // custom filter - vyhodnocuje se pro každý řádek tabulky
  customFilterPredicate() {
    const myFilterPredicate = (data: User, filter: string): boolean => {
      
      var globalMatch = !this.globalFilter;

      // posoudí jestli řádek matchuje globální search, pokud ano, tak zkouší i sloupcové. 
      // běžný predicate by to nemusel posuzovat per sloupec, protože posuzuje řádek jako celek
      if (this.globalFilter) {
        globalMatch =
        data.Locality.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
        data.MAC.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1 ||
        data.PhoneNumber.toString().trim().toLowerCase().indexOf(this.globalFilter.toLowerCase()) !== -1;
      }

      // globalMatch je true pokud se globalSearch v řádku našel. Pokud ne, tak končím, neb sloupcové už nic nezmění
      if (!globalMatch) {
        //console.log("Netrefil jsem u " + data.ID)
        return false;
      }
      //console.log("global je true");
      // do filtru vstupuje stringifikovaný json hodnot objektu filteredValues. Případ kdy je global match true, ale sloupcové prázdné funguje, protože
      // indexOf vrací pro prázdný string v json objektu "searchString" true
      
      let searchString = JSON.parse(filter);
     // console.log(searchString);
      var a = data.Locality.toString().trim().indexOf(searchString.Locality) !== -1;
      var b = data.MAC.toString().trim().indexOf(searchString.PhoneNumber) !== -1;
      var c = data.PhoneNumber.toString().trim().indexOf(searchString.MAC) !== -1;
     // console.log(a + " " + b + " " + c)
      var res = a && b && c;
      return res;
    }
    return myFilterPredicate;
  }

}

// napoveda zde: https://stackblitz.com/edit/angular-hbakxo-5jeaic?file=app%2Ftable-filtering-example.ts