import { Component, OnInit } from '@angular/core';
import { CodMwStatusService } from '../shared/services/cod-mw-status.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading = false;
  reqFinished = false;
  players = [];

  constructor(
    private statusService: CodMwStatusService
  ) { }

  ngOnInit() {
    this.getPlayersStatus();
  }

  getPlayersStatus() {
    this.players = [];
    this.loading = true;
    this.reqFinished = false;
    this.statusService.getPlayersStatus().subscribe((data: any) => {
      this.players = data;
      this.loading = false;
      this.reqFinished = true;
    }, err => {
      this.loading = false;
      this.reqFinished = true;
    });
  }

  refresh(event) {
    event.preventDefault();
    this.getPlayersStatus();
  }

}
