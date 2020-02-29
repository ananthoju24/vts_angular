import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VtsService {

  constructor(private http: HttpClient) { }
  //public baseUrl = "http://52.66.204.116:8080/vts/";
  public baseUrl = "http://localhost:8080/vts/";
  public static serviceURL = {
    login: "login",
    home: "home",
    search: "search",
    viewtax: "viewtax",
    addTax: "addtaxdetails",
    fetchTax: "fetchtax",
    fetchPrevTax: "fetchPrevTax",
    taxPayment: "tax/payment",
    editTax: "editTax",
    enrollhouse: "enroll",
    fetchTransaction: "/fetch/transaction",
    fetch: "fetch",
    fetchTransactionsByDate : "fetchTransactionsByDate",
    cancelTransaction : "/cancel/transaction/",
    updateTaxDetails : "updatetax"
  }

  getService(url) {
    var localStorageVariable = '';
    if (localStorage.getItem('Auth-Token')) {
      localStorageVariable = localStorage.getItem('Auth-Token');
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Auth-Token': localStorageVariable
      })
    };
    return this.http.get(this.baseUrl + url, httpOptions).pipe(map((response: any) => response));
  }
  postService(url, data) {
    var localStorageVariable = '';
    if (localStorage.getItem('Auth-Token')) {
      localStorageVariable = localStorage.getItem('Auth-Token');
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Auth-Token': localStorageVariable
      })
    };
    console.log(data)
    return this.http.post(this.baseUrl + url, data, httpOptions).pipe(map((response: any) => response));
  }

}
