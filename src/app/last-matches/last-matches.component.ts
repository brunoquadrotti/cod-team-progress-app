import { Component, OnInit } from '@angular/core';
import { CodMwStatusService } from '../shared/services/cod-mw-status.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-last-matches',
  templateUrl: './last-matches.component.html',
  styleUrls: ['./last-matches.component.scss']
})
export class LastMatchesComponent implements OnInit {

  matches: any;
  loading = false;

  constructor(
    private codService: CodMwStatusService,
    private utils: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;

    const $obs1 = this.codService.getMWcombatwz({
      gamertag: 'iDarkHorse x',
      platform: 'xbl'
    });
    const $obs2 = this.codService.getMWcombatwz({
      gamertag: 'NyahBinghizZ',
      platform: 'xbl'
    });
    const $obs3 = this.codService.getMWcombatwz({
      gamertag: 'iquee#11219',
      platform: 'battle'
    });
    const $obs4 = this.codService.getMWcombatwz({
      gamertag: 'gdose#2859135',
      platform: 'uno'
    });
    const $obs5 = this.codService.getMWcombatwz({
      gamertag: 'Flagship#7434196',
      platform: 'uno'
    });
    const $obs6 = this.codService.getMWcombatwz({
      gamertag: 'RachaCuca080',
      platform: 'xbl'
    });
    const $obs7 = this.codService.getMWcombatwz({
      gamertag: 'xXiBigheroXx',
      platform: 'xbl'
    });
    const $obs8 = this.codService.getMWcombatwz({
      gamertag: 'brualva',
      platform: 'psn'
    });

    forkJoin([$obs1, $obs2, $obs3, $obs4, $obs5, $obs6, $obs7, $obs8]).subscribe((results) => {

      const matches = [];

      const getMatch = (matchID) => {
        const match = matches.filter(match => {
          if (match && match.matchID) {
            return match.matchID === matchID;
          }
          return false;
        })[0];
        return match;
      };

      results.forEach(player => {

        player.matches.forEach(playerMatch => {
          const match = getMatch(playerMatch.matchID);

          if (!match) {
            matches.push({
              startDate: new Date(playerMatch.utcStartSeconds * 1000),
              endDate: new Date(playerMatch.utcEndSeconds * 1000),
              mode: playerMatch.mode,
              matchID: playerMatch.matchID,
              teamPlacement: this.utils.getPosition(playerMatch?.playerStats?.teamPlacement || 0),
              players: [{
                username: playerMatch.player.username,
                ...playerMatch.playerStats
              }]
            });
          } else {
            match.players.push({
              username: playerMatch.player.username,
              ...playerMatch.playerStats
            })
          }
        });
      });

      this.matches = matches;

      // console.log(this.matches);

      this.loading = false;

    }, (err) => {
      console.error(err);
      this.loading = false;
    });
  }

  back(event) {
    this.router.navigate(['']);
  }

  getBrCode(code) {
    return this.utils.getBrCode(code);
  }

  getFormattedRatio(num) {
    return this.utils.getFormattedRatio(num, 1);
  }

  isWinner(teamPlacement) {
    return this.utils.isWinner(teamPlacement);
  }

}
