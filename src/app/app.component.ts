import { Component, OnInit } from '@angular/core';
import { CodMwStatusService } from './cod-mw-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cod-team-performance-app';

  players = [{
    gamertag: 'iDarkHorse x',
    displayName: 'iDarkHorse x',
    platform: 'xbl'
  }, {
    gamertag: 'NyahBingui5947',
    displayName: 'NyahBinghi',
    platform: 'xbl'
  }, {
    gamertag: 'iquee#11219',
    displayName: 'iquee',
    platform: 'battle'
  }, {
    gamertag: 'gdose#2859135',
    displayName: 'gdose',
    platform: 'uno'
  }, {
    gamertag: 'Flagship#7434196',
    displayName: 'Flagship',
    platform: 'uno'
  }];

  playersResult = [];

  constructor(
    private statusService: CodMwStatusService
  ) { }

  ngOnInit() {
    this.players.forEach(player => {
      this.statusService.getStatus(player.gamertag).subscribe(data => {
        console.log(data);
        this.playersResult.push(data);
      });
    });
  }

  getFormattedNumber(num) {
    return num.toFixed(2);
  }

  getKillsProgress(data) {
    const A1 = data.weekly.mode.br_all.properties.kills / data.weekly.mode.br_all.properties.matchesPlayed;
    const B1 = data.lifetime.mode.br_all.properties.kills / data.lifetime.mode.br_all.properties.gamesPlayed;
    return this.getFormattedNumber(((A1 / B1) - 1) * 100);
  }

  getDeathsProgress(data) {
    const A1 = data.weekly.mode.br_all.properties.deaths / data.weekly.mode.br_all.properties.matchesPlayed;
    const B1 = data.lifetime.mode.br_all.properties.deaths / data.lifetime.mode.br_all.properties.gamesPlayed;
    return this.getFormattedNumber(((A1 / B1) - 1) * 100);
  }

  getRatioProgress(data) {
    const A1 = data.weekly.mode.br_all.properties.kdRatio;
    const B1 = data.lifetime.mode.br_all.properties.kdRatio;
    return this.getFormattedNumber(((A1 / B1) - 1) * 100);
  }
}
