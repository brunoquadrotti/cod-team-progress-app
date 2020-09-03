import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'smart-card-user',
  templateUrl: './smart-card-user.component.html',
  styleUrls: ['./smart-card-user.component.scss']
})
export class SmartCardUserComponent implements OnInit {

  @Input()
  player: any;
  regimentCode = 'PBCzX';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {}

  openProfile(gamertag, platform) {
    this.router.navigate(['/profile', platform, gamertag]);
  }

  // TODO: Adicionar num service esses métodos auxiliares abaixo
  getFormattedNumber(num) {
    if (typeof num === 'number') {
      return +num.toFixed(2);
    }

    return 0;
  }

  getKillsProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'kills') / this.getGenericValue(data, 'weekly', 'matchesPlayed');
    const B1 = this.getGenericValue(data, 'lifetime', 'kills') / this.getGenericValue(data, 'lifetime', 'gamesPlayed');
    return this.getFormattedNumber(((A1 / B1) - 1) * 100) || 0;
  }

  getDeathsProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'deaths') / this.getGenericValue(data, 'weekly', 'matchesPlayed');
    const B1 = this.getGenericValue(data, 'lifetime', 'deaths') / this.getGenericValue(data, 'lifetime', 'gamesPlayed');
    return this.getFormattedNumber(((A1 / B1) - 1) * 100) || 0;
  }

  getRatioProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'kdRatio');
    const B1 = this.getGenericValue(data, 'lifetime', 'kdRatio');
    return this.getFormattedNumber(((A1 / B1) - 1) * 100) || 0;
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
