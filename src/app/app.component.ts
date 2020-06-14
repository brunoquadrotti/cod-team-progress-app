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
  }, {
    gamertag: 'xX iPredador Xx',
    displayName: 'xX iPredador Xx',
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
    if (typeof num === 'number') {
      return num.toFixed(2);
    }

    return 0;
  }

  getKillsProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'kills') / this.getGenericValue(data, 'weekly', 'matchesPlayed');
    const B1 = this.getGenericValue(data, 'lifetime', 'kills') / this.getGenericValue(data, 'lifetime', 'gamesPlayed');
    return this.getFormattedNumber(((A1 / B1) - 1) * 100);
  }

  getDeathsProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'deaths') / this.getGenericValue(data, 'weekly', 'matchesPlayed');
    const B1 = this.getGenericValue(data, 'lifetime', 'deaths') / this.getGenericValue(data, 'lifetime', 'gamesPlayed');
    return this.getFormattedNumber(((A1 / B1) - 1) * 100);
  }

  getRatioProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'kdRatio');
    const B1 = this.getGenericValue(data, 'lifetime', 'kdRatio');
    return this.getFormattedNumber(((A1 / B1) - 1) * 100);
  }

  getGenericValue(data, period, prop) {
    if (data[period].mode.br_all
      && data[period].mode.br_all.properties
      && data[period].mode.br_all.properties[prop]) {
        return data[period].mode.br_all.properties[prop];
    }

    return 0;
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
