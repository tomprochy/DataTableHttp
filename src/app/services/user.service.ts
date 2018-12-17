import { Injectable }   from '@angular/core';
import { HttpClient,HttpHeaders }   from '@angular/common/http';
import { Observable }   from 'rxjs';
//import 'rxjs/add/operator/map';
import { User } from '../models/user.model';


@Injectable()
export class UserService {
  private serviceUrl2 = 'https://jsonplaceholder.typicode.com/comments';
  private serviceUrl3 = 'http://mtsolappservices.net.csin.cz/staticData/myData.txt';
  
  private serviceUrl4 = 'http://mtsolappservices.net.csin.cz/BeeMobile/BMobileAccessPointsapi/AccessPointJsonData'
  private serviceUrl='api/accesPoints/accesPointListing.json'
  private httpGetOptions =
  {   
      withCredentials: true,
  };

  constructor(private http: HttpClient) { 

  }
  
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.serviceUrl,this.httpGetOptions);
  }
}