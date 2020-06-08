import { Component, OnInit } from '@angular/core';
import { CodMwStatusService } from './cod-mw-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  regimentCode = 'PBCzX';

  // TODO: Obter de uma API esses dados
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
  }, {
    gamertag: 'RachaCuca080',
    displayName: 'RachaCuca',
    platform: 'xbl'
  }];

  playersResult = [];

  constructor(
    private statusService: CodMwStatusService
  ) { }

  ngOnInit() {
    this.getPlayersStatus();
  }

  getPlayersStatus() {
    this.statusService.getPlayersStatus(this.players).subscribe((data: any) => {
      this.playersResult = data;
    });
  }

  // TODO: Adicionar num service esses métodos auxiliares abaixo
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

  getClassNum(num, inverse = false) {

    let isNegative = this.isNegative(num);

    if (inverse) {
      isNegative = !isNegative;
    }

    return isNegative ? 'text-danger' : 'text-success';
  }

  private isNegative(num) {
    return (num < 0);
  }
}
