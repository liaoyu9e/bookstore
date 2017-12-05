import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class GetBookService {

  constructor(private http: Http) { }
  
  getBook(id:number){
	  let url = "http://localhost:8080/book/" + id;
	  let headers = new Headers({
		  'x-auth-token':localStorage.getItem('xAuthToken')
	  });
	  return this.http.get(url, {headers: headers});
  }

}
