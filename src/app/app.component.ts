import { Component, OnInit } from '@angular/core';
import { Analytics } from "@vercel/analytics/next";
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dashboard-seo';
  isAuthenticated = false;
  
  constructor(private authService: AuthService) {
    // Vercel Analytics s'initialise automatiquement
  }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  logout() {
    this.authService.logout();
  }
}
