import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  // baseUrl = "https://k8nlqs1lw0.execute-api.us-west-1.amazonaws.com/staging/";
  baseUrl = "https://bazbi3krji.execute-api.us-east-1.amazonaws.com/prod/";

  constructor(
    private http: HttpClient,
  ) { }

  fetchAll(APIName: string) {
    return this.http.get(`${this.baseUrl}${APIName}`);
  }

  fetchSingle(APIName: string, id: string) {
    return this.http.get(`${this.baseUrl}${APIName}/${id}`);
  }

  post(APIName: string, body: any) {
    return this.http.post(`${this.baseUrl}${APIName}`, body);
  }

  put(APIName: string, body: any, id: string) {
    return this.http.put(`${this.baseUrl}${APIName}/${id}`, body);
  }

  delete(APIName: string, id: string) {
    return this.http.delete(`${this.baseUrl}${APIName}/${id}`);
  }

  // ------------------- CRUD Closed
}
