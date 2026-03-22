import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface KpiData {
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
}

export interface TrafficPoint {
  date: string;
  label: string;
  sessions: number;
  users: number;
  pageviews: number;
  organic: number;
}

export interface TopPage {
  url: string;
  title: string;
  views: number;
  trendIcon?: string;
  trendPercent?: number;
}

export interface Keyword {
  keyword: string;
  clicks: number;
  impressions: number;
  position: number;
}

@Injectable({
  providedIn: 'root'
})
export class SeoDataService {

  constructor() { }

  getKpis(startDate?: string, endDate?: string): Observable<any> {
    // Mock data for demonstration
    return of({
      success: true,
      total: {
        sessions: 12847,
        activeUsers: 8392,
        pageviews: 45128,
        bounceRate: 42.3
      },
      data: this.generateMockTrafficData()
    });
  }

  getTrafficData(): Observable<TrafficPoint[]> {
    return of(this.generateMockTrafficData());
  }

  getTopPages(): Observable<TopPage[]> {
    return of([
      { url: '/', title: 'Accueil', views: 3421 },
      { url: '/services', title: 'Services', views: 2156 },
      { url: '/blog', title: 'Blog', views: 1876 },
      { url: '/contact', title: 'Contact', views: 1234 },
      { url: '/about', title: 'À propos', views: 987 }
    ]);
  }

  getKeywords(): Observable<Keyword[]> {
    return of([
      { keyword: 'audit seo gratuit', clicks: 342, impressions: 5421, position: 3.2 },
      { keyword: 'referencement site', clicks: 289, impressions: 4234, position: 4.1 },
      { keyword: 'optimisation seo', clicks: 267, impressions: 3876, position: 5.3 },
      { keyword: 'consultant seo paris', clicks: 198, impressions: 2987, position: 6.7 },
      { keyword: 'agence web lyon', clicks: 156, impressions: 2345, position: 7.2 }
    ]);
  }

  private generateMockTrafficData(): TrafficPoint[] {
    const data: TrafficPoint[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const sessions = Math.floor(Math.random() * 2000) + 800;
      const users = Math.floor(sessions * (0.6 + Math.random() * 0.2));
      const pageviews = Math.floor(sessions * (2 + Math.random() * 2));
      const organic = Math.floor(sessions * (0.4 + Math.random() * 0.3));
      
      data.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        sessions,
        users,
        pageviews,
        organic
      });
    }
    
    return data;
  }
}
