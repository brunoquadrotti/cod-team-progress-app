import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';

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
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {}

  openProfile(gamertag, platform) {
    this.router.navigate(['/profile', platform, gamertag]);
  }

  getFormattedValue(num) {
    return this.utils.getFormattedValue(num);
  }

  getKillsProgress(data) {
    return this.utils.getKillsProgress(data);
  }

  getDeathsProgress(data) {
    return this.utils.getDeathsProgress(data);
  }

  getRatioProgress(data) {
    return this.utils.getRatioProgress(data);
  }

  getClassNum(num, inverse = false) {
    return this.utils.getClassNum(num, inverse);
  }
}
