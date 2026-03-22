import { Component } from '@angular/core';
import { Analytics } from "@vercel/analytics/next";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dashboard-seo';
  
  constructor() {
    // Vercel Analytics s'initialise automatiquement
  }
}
