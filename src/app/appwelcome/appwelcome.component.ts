import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appwelcome',
  templateUrl: './appwelcome.component.html',
  styleUrls: ['./appwelcome.component.css']
})
export class AppwelcomeComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }
  onLogOut() {
    this.authService.logout();
  }

}
