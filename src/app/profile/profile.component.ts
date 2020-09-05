import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodMwStatusService } from '../shared/services/cod-mw-status.service';
import { forkJoin } from 'rxjs';
import { UtilsService } from '../shared/services/utils.service';

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
    private utils: UtilsService,
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
    return this.utils.getBrCode(code);
  }

  getPosition(teamPlacement) {
    return this.utils.getPosition(teamPlacement);
  }

  getStartDate(date) {
    return this.utils.getStartDate(date);
  }

  getFormattedRatio(num) {
    return this.utils.getFormattedRatio(num);
  }

  isWinner(position) {
    return this.utils.isWinner(position);
  }

  getLabel(key) {
    return this.utils.getLabel(key);
  }

  getFormattedValue(val) {
    return this.utils.getFormattedValue(val);
  }
}
