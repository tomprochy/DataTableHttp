import { Injectable }   from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
//import 'rxjs/add/operator/map';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
  private serviceUrl = 'https://jsonplaceholder.typicode.com/comments';
  private serviceUrl3 = 'http://mtsolappservices.net.csin.cz/staticData/myData.txt';
  
  private serviceUrl2 = 'https://my-json-server.typicode.com/tomprochy/DataTableHttp/db'
  
  constructor(private http: HttpClient) { }
  
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.serviceUrl);
  }
  
}