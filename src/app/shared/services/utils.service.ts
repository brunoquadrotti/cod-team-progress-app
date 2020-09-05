import { Injectable } from '@angular/core';
import { BrCodes } from '../enums/br-code.enum';
import { PlayerStats } from '../literals/player-stats.literals';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getBrCode(code) {
    return BrCodes[code] || code;
  }

  getFormattedRatio(num = 0, fixed = 2) {
    return +num.toFixed(fixed);
  }

  getPosition(teamPlacement: number) {
    return teamPlacement;
  }

  isWinner(position: number) {
    return position === 1;
  }

  getStartDate(date) {
    return new Date(date * 1000);
  }

  getLabel(key) {
    if (!PlayerStats[key]) {
      console.log('Esse não existe: ', key);
    }
    return PlayerStats[key] || this.capitalizeFirstLetter(key);
  }

  getFormattedValue(val, fixed = 2) {
    if (typeof val === 'number') {
      return +val.toFixed(fixed);
    }

    return val;
  }

  getKillsProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'kills') / this.getGenericValue(data, 'weekly', 'matchesPlayed');
    const B1 = this.getGenericValue(data, 'lifetime', 'kills') / this.getGenericValue(data, 'lifetime', 'gamesPlayed');
    return this.getFormattedValue(((A1 / B1) - 1) * 100) || 0;
  }

  getDeathsProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'deaths') / this.getGenericValue(data, 'weekly', 'matchesPlayed');
    const B1 = this.getGenericValue(data, 'lifetime', 'deaths') / this.getGenericValue(data, 'lifetime', 'gamesPlayed');
    return this.getFormattedValue(((A1 / B1) - 1) * 100) || 0;
  }

  getRatioProgress(data) {
    const A1 = this.getGenericValue(data, 'weekly', 'kdRatio');
    const B1 = this.getGenericValue(data, 'lifetime', 'kdRatio');
    return this.getFormattedValue(((A1 / B1) - 1) * 100) || 0;
  }

  getClassNum(num, inverse = false) {

    let isNegative = this.isNegative(num);

    if (inverse) {
      isNegative = !isNegative;
    }

    return isNegative ? 'text-danger' : 'text-success';
  }

  private getGenericValue(data, period, prop) {
    if (data[period].mode.br_all
      && data[period].mode.br_all.properties
      && data[period].mode.br_all.properties[prop]) {
        return data[period].mode.br_all.properties[prop];
    }
    return 0;
  }

  private isNegative(num) {
    return (num < 0);
  }

  private capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
