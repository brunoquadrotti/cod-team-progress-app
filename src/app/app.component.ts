import { Component, OnInit } from '@angular/core';
import { CodMwStatusService } from './cod-mw-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loading = false;
  regimentCode = 'PBCzX';

  players = [];

  constructor(
    private statusService: CodMwStatusService
  ) { }

  ngOnInit() {
    this.getPlayersStatus();
  }

  getPlayersStatus() {
    this.loading = true;
    this.statusService.getPlayersStatus().subscribe((data: any) => {
      this.players = data;
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  refresh(event) {
    event.preventDefault();
    this.players = [];
    this.getPlayersStatus();
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
