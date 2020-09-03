import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodMwStatusService } from '../cod-mw-status.service';
import { BrCodes } from '../enums/br-code.enum';
import { forkJoin } from 'rxjs';
import { PlayerStats } from '../literals/player-stats.literals';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  playerFuzzySearch: any;
  playerCombatwz: any;
  gamertag: string;
  platform: string;
  loading = false;
  objectKeys = Object.keys;

  constructor(
    private activatedRoute: ActivatedRoute,
    private codService: CodMwStatusService,
    private router: Router
  ) {
    this.gamertag = this.activatedRoute.snapshot.paramMap.get('gamertag');
    this.platform = this.activatedRoute.snapshot.paramMap.get('platform');
  }

  ngOnInit(): void {
    this.loading = true;
    const player = {
      gamertag: this.gamertag,
      platform: this.platform
    };

    const $obs1 = this.codService.getFuzzySearch(player);
    const $obs2 = this.codService.getMWcombatwz(player);

    forkJoin([$obs1, $obs2]).subscribe((results) => {
      this.playerFuzzySearch = results[0][0];
      this.playerCombatwz = results[1];
      console.log(results[1]);
      this.loading = false;
    }, (err) => {
      console.error(err);
    });
  }

  back(event) {
    this.router.navigate(['']);
  }

  getBrCode(code) {
    return BrCodes[code] || code;
  }

  getPosition(matche) {
    let position = 0;

    if (matche.mode === 'brtdm_113' || matche.mode === 'brtdm_rmbl') {

      if (matche.player.result) {
        if (matche.player.result === 'win') {
          position = 1;
        } else {
          position = 2;
        }
      }

      if (matche.rankedTeams) {
        const playerTeam = matche.player.team;
        matche.rankedTeams.forEach((team, idx) => {
          if (team.name === playerTeam) {
            position = idx + 1;
          }
        });
      }

      return position;
    }

    if (matche.playerStats.teamPlacement) {
      return matche.playerStats.teamPlacement;
    } else {
      return position;
    }
  }

  getStartDate(date) {
    return new Date(date * 1000);
  }

  getFormattedRatio(num) {
    return +num.toFixed(2);
  }

  isWinner(position) {
    return position === 1;
  }

  getLabel(key) {
    if (!PlayerStats[key]) {
      console.log('Esse não existe: ', key);
    }
    return PlayerStats[key] || this.capitalizeFirstLetter(key);
  }

  getFormattedValue(val) {
    if (typeof val === 'number') {
      return +val.toFixed(2);
    }

    return val;
  }

  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
