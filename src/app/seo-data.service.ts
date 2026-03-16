import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface KpiData {
  sessions: number;
  users: number;
  pageviews: number;
  bounceRate: number;
}

export interface TrafficPoint {
  label: string;
  sessions: number;
  organic: number;
}

export interface TopPage {
  url: string;
  views: number;
  trend: string;
  trendIcon?: string;
  trendPercent?: number;
}

export interface Keyword {
  keyword: string;
  term?: string;
  position: number;
  ctr: number;
}

@Injectable({
  providedIn: 'root'
})
export class SeoDataService {
  // URL de votre backend déployé
  private apiUrl = 'http://localhost:5000/api';
  
  constructor(private http: HttpClient) {}

  // KPIs principaux
  getKpis(startDate?: string, endDate?: string): Observable<any> {
    let url = `${this.apiUrl}/analytics`;
    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
    }
    return this.http.get(url);
  }

  // Données de trafic (pour graphiques)
  getTrafficData(startDate?: string, endDate?: string): Observable<any> {
    return this.getKpis(startDate, endDate);
  }

  // Top pages
  getTopPages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-pages`);
  }

  // Mots-clés
  getKeywords(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/keywords`);
  }
}
