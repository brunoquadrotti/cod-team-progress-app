import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodMwStatusService {

  FIREBASE_API = environment.firebaseApiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getPlayerStatus(player) {

    const playersStoraged = JSON.parse(
      localStorage.getItem('player')
    );

    const lastUpdateDate = new Date(
      JSON.parse(localStorage.getItem('lastPlayerUpdateDate'))
    );

    const isValidDate = Date.now() - lastUpdateDate.getTime() < 1800000; // 30 minutos

    if (playersStoraged && isValidDate) {
      return of(
        playersStoraged
      );
    }

    return this.http.get(`${this.FIREBASE_API}/getPlayerStatus`, {
      params: {
        player: JSON.stringify(player)
      }
    }).pipe(
      map(data => {
        localStorage.setItem('player', JSON.stringify(data));
        localStorage.setItem('lastPlayerUpdateDate', JSON.stringify(Date.now()));
        return data;
      })
    );
  }

  getPlayersStatus() {

    const playersStoraged = JSON.parse(
      localStorage.getItem('players')
    );

    const lastUpdateDate = new Date(
      JSON.parse(localStorage.getItem('lastPlayersUpdateDate'))
    );

    const isValidDate = Date.now() - lastUpdateDate.getTime() < 1800000; // 30 minutos

    if (playersStoraged && isValidDate) {
      return of(
        playersStoraged
      );
    }

    return this.http.get(`${this.FIREBASE_API}/getPlayersStatus`).pipe(
      map(data => {
        localStorage.setItem('players', JSON.stringify(data));
        localStorage.setItem('lastPlayersUpdateDate', JSON.stringify(Date.now()));
        return data;
      })
    );
  }
}
