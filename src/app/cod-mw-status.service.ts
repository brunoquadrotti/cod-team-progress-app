import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CodMwStatusService {

  constructor(
    private http: HttpClient
  ) { }

  getStatus(gamertag) {
    return this.http.get(`/assets/json/${encodeURIComponent(gamertag)}.json`);
  }
}
