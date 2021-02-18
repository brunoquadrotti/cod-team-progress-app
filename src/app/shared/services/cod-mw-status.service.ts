import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodMwStatusService {

  FIREBASE_API = environment.firebaseApiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getMWcombatwz(player): Observable<any> {

    return this.baseRequest('getMWcombatwz', {
      params: {
        player: JSON.stringify(player)
      }
    });
  }

  getFriendFeed(player): Observable<any> {

    return this.baseRequest('getFriendFeed', {
      params: {
        player: JSON.stringify(player)
      }
    });
  }

  getFuzzySearch(player): Observable<any> {

    return this.baseRequest('getFuzzySearch', {
      params: {
        player: JSON.stringify(player)
      }
    });
  }

  getPlayerStatus(player): Observable<any> {

    return this.baseRequest('getPlayerStatus', {
      params: {
        player: JSON.stringify(player)
      }
    });
  }

  getPlayersStatus(): Observable<any> {

    return this.baseRequest('getPlayersStatus');
  }

  private baseRequest(method, options?): Observable<any> {

    return this.http.get(`${this.FIREBASE_API}/${method}`, options);
  }
}
