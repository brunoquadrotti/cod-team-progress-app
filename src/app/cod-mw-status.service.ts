import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodMwStatusService {

  FIREBASE_API = environment.firebaseApiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getStatus(gamertag) {
    return this.http.get(`/assets/json/${encodeURIComponent(gamertag)}.json`);
  }

  getPlayerStatus(player) {
    return this.http.get(`${this.FIREBASE_API}/getPlayerStatus`, {
      params: {
        player: JSON.stringify(player)
      }
    });
  }

  getPlayersStatus() {
    return this.http.get(`${this.FIREBASE_API}/getPlayersStatus`);
  }
}
