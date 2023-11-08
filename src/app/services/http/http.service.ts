import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  get(url) {
    return this.http.get<any>(url);
  }

  post(url, body) {
    return this.http.post<any>(url, body);
  }
}
