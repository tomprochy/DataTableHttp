import { Component, OnInit, ViewChild, ChangeDetectorRef  } from '@angular/core';
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
  arr: Array<{ID: number, Locality: string, PhoneNumber: string, MAC: string}> = [
    {
      "ID": 1,
      "Locality": "Antal Office ggg",
      "PhoneNumber": "83067",
      "MAC": "0C680348B3A0"
  },
  {
      "ID": 2,
      "Locality": "Antal Office mmm",
      "PhoneNumber": "83067",
      "MAC": "0C68035EB550"
  },
  {
      "ID": 3,
      "Locality": "Antal Office hhh",
      "PhoneNumber": "83067",
      "MAC": "0C68032D8CB0"
  },

  ];

// zde jsem skončil, zdá se že díky novému způsobu načítání dat to mám vyladěné

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
    this.dataSource = new MatTableDataSource(this.Users);
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.dataSource.filter = JSON.stringify(this.filteredValues);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshData();
 
    this.interval = setInterval(() => {
      this.refreshData();
    }, 10000);


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
        this.dataSource.data = this.Users;
        //console.log(JSON.stringify(this.dataSource.data));
        //console.log("nactenaData poradi: "+ this.num + JSON.stringify(this.Users));
        // Varianta s printem dat.
        //console.log("nactenaData poradi: "+ this.num + JSON.stringify(Usersbb));
        this.num++;
        if (this.runOrder == 2)
        {
          console.log("runorder2")
          this.dataSource.data = this.arr;
        }
      },
      error => {
        this.errorMessage = <any>error;
        console.log(this.errorMessage);
      },
      () => {
        


        // zde jsem skončil, upravil jsem načítání matTable s tím, že ve subscribe-final větvi je jen při prvním běhu, pak již ne, zatím se zdá vše OK
      //  console.log("subscribe hotovo")
        this.runOrder++;
      }
    );
  }

  ngAfterViewInit() {

    console.log('on after init function');
    
  }

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