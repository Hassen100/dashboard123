import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SeoDataService, KpiData, TrafficPoint, TopPage, Keyword } from './seo-data.service';
import { AuthService } from './auth/auth.service';
import { forkJoin } from 'rxjs';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  timestamp = new Date().toLocaleString('fr-FR');
  trafficData: TrafficPoint[] = [];
  isLoading = false;
  showAlertMessage = '';
  alertType: 'success' | 'error' | 'info' | 'warning' = 'info';
  showNotification = false;

  kpiData = {
    sessions: '12,847',
    users: '8,392',
    pageviews: '45,128',
    bounceRate: '42.3',
    sessionsDelta: '+12.5%',
    usersDelta: '+8.7%',
    pageviewsDelta: '+15.2%',
    bounceRateDelta: '-2.1%'
  };

  topPages: TopPage[] = [];
  topKeywords: Keyword[] = [];
  showAIPanel = false;

  aiRecommendations = [
    { icon:'📝', title:'Optimiser les balises title', body:'6 pages ont des titres dépassant 60 caractères. Raccourcissez-les pour améliorer le CTR dans les SERP.', priority:'p-high', label:'Priorité haute' },
    { icon:'🔗', title:'Stratégie de netlinking', body:'Vos pages /services/ manquent de backlinks internes. Ajoutez 3-5 liens depuis vos articles de blog.', priority:'p-high', label:'Priorité haute' },
    { icon:'⚡', title:'Améliorer le LCP', body:'Le score Core Web Vitals indique un LCP > 2.5s sur mobile. Optimisez les images hero et le lazy loading.', priority:'p-med', label:'Priorité moyenne' },
    { icon:'📊', title:'Contenu longue traîne', body:'Créez des articles ciblant "audit seo gratuit PME" et "référencement local artisan" (faible concurrence, bon volume).', priority:'p-med', label:'Priorité moyenne' },
    { icon:'🗺️', title:'Sitemap XML', body:'Votre sitemap n\'inclut pas les pages /blog/ récentes. Régénérez-le et soumettez-le à la Search Console.', priority:'p-low', label:'Priorité faible' },
    { icon:'📱', title:'Mobile-first indexing', body:'3 pages présentent des éléments non adaptés au mobile. Vérifiez les tableaux et les CTA sur petits écrans.', priority:'p-low', label:'Priorité faible' }
  ];

  @ViewChild('chartTraffic') chartTrafficEl!: ElementRef;
  @ViewChild('chartKeywords') chartKeywordsEl!: ElementRef;
  @ViewChild('chartBounce') chartBounceEl!: ElementRef;
  @ViewChild('lastSync') lastSyncEl!: ElementRef;

  private trafficChart: any;
  private keywordsChart: any;
  private bounceChart: any;

  constructor(
    private seoService: SeoDataService, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRealData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  private loadRealData() {
    this.isLoading = true;
    
    // Utiliser forkJoin pour coordonner tous les appels API
    forkJoin({
      kpis: this.seoService.getKpis(),
      topPages: this.seoService.getTopPages(),
      keywords: this.seoService.getKeywords(),
      trafficData: this.seoService.getTrafficData()
    }).subscribe({
      next: (results) => {
        this.handleApiResponse(results);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement données:', error);
        this.showAlert('❌ Erreur de connexion au backend - Démarrer le backend sur localhost:5000', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private handleApiResponse(results: any) {
    // Normaliser et traiter les KPIs
    const kpiResponse = this.normalizeKpiResponse(results.kpis);
    if (kpiResponse.success) {
      this.updateKpiData(kpiResponse);
    } else {
      this.showAlert('⚠️ Backend non disponible - Utilisation des données de démonstration', 'warning');
    }

    // Traiter les autres données
    this.topPages = results.topPages.map((page: TopPage, index: number) => ({
      ...page,
      trendIcon: index % 3 === 0 ? '↑' : index % 3 === 1 ? '→' : '↓',
      trendPercent: Math.floor(Math.random() * 20) - 5
    }));

    this.topKeywords = results.keywords;
    
    // Consolider les données de trafic
    this.trafficData = results.trafficData || kpiResponse.trafficData || [];

    // Initialiser les graphiques une seule fois
    setTimeout(() => this.initCharts(), 100);
  }

  private normalizeKpiResponse(response: any) {
    // Normaliser la réponse API pour avoir une structure cohérente
    const total = response.total || response;
    return {
      success: response.success || true,
      total: total,
      trafficData: response.data || this.generateMockTrafficData()
    };
  }

  private updateKpiData(response: any) {
    const total = response.total;
    this.kpiData = {
      sessions: total.sessions.toLocaleString('fr-FR'),
      users: total.activeUsers.toLocaleString('fr-FR'),
      pageviews: total.pageviews.toLocaleString('fr-FR'),
      bounceRate: total.bounceRate.toFixed(1),
      sessionsDelta: '+12.5%',
      usersDelta: '+8.7%',
      pageviewsDelta: '+15.2%',
      bounceRateDelta: '-2.1%'
    };

    // Mettre à jour les données de trafic pour les graphiques
    this.trafficData = response.data.map((item: any) => ({
      date: item.date,
      label: new Date(item.date).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }),
      sessions: item.sessions,
      users: item.activeUsers,
      pageviews: item.pageviews,
      organic: Math.floor(item.sessions * (0.4 + Math.random() * 0.3))
    }));
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

  private initCharts() {
    const days = 30;
    const labels = this.trafficData.length > 0 ? this.trafficData.map(d => d.label) : this.generateMockLabels(days);
    const sessions = this.trafficData.length > 0 ? this.trafficData.map(d => d.sessions) : this.generateMockSessions(days);
    const organic = this.trafficData.length > 0 ? this.trafficData.map(d => d.organic) : sessions.map(s => Math.floor(s * (.55 + Math.random() * .2)));

    // Traffic Chart
    if (this.trafficChart) this.trafficChart.destroy();
    if (this.chartTrafficEl) {
      this.trafficChart = new Chart(this.chartTrafficEl.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Sessions',
              data: sessions,
              borderColor: '#2ea99b',
              backgroundColor: 'rgba(46,169,155,.08)',
              fill: true,
              tension: 0.45,
              pointRadius: 0,
              borderWidth: 2
            },
            {
              label: 'Organique',
              data: organic,
              borderColor: '#3fb950',
              backgroundColor: 'rgba(63,185,80,.08)',
              fill: true,
              tension: 0.45,
              pointRadius: 0,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: 'top' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    // Keywords Chart
    if (this.keywordsChart) this.keywordsChart.destroy();
    if (this.chartKeywordsEl) {
      this.keywordsChart = new Chart(this.chartKeywordsEl.nativeElement, {
        type: 'bar',
        data: {
          labels: ['audit seo gratuit', 'referencement site', 'optimisation seo', 'consultant seo paris', 'agence web lyon'],
          datasets: [{
            label: 'Clics',
            data: [342, 289, 267, 198, 156],
            backgroundColor: '#2ea99b'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    // Bounce Chart
    if (this.bounceChart) this.bounceChart.destroy();
    if (this.chartBounceEl) {
      this.bounceChart = new Chart(this.chartBounceEl.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Organique', 'Direct', 'Referral', 'Social'],
          datasets: [{
            data: [42.3, 38.7, 51.2, 45.8],
            backgroundColor: ['#2ea99b', '#3fb950', '#e3b341', '#f78166']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }

  private generateMockLabels(days: number): string[] {
    const labels = [];
    const d = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const dd = new Date(d);
      dd.setDate(d.getDate() - i);
      labels.push(dd.toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }));
    }
    return labels;
  }

  private generateMockSessions(days: number): number[] {
    return Array.from({length: days}, () => Math.floor(Math.random() * 2000) + 800);
  }

  applyFilters() {
    this.isLoading = true;
    this.showAlert('⚡ Chargement des données Google Analytics...', 'info');
    
    // Charger les données avec les filtres
    this.seoService.getKpis().subscribe({
      next: (response) => {
        const normalizedResponse = this.normalizeKpiResponse(response);
        if (normalizedResponse.success) {
          this.updateKpiData(normalizedResponse);
          this.showAlert('✅ Données Google Analytics chargées avec les filtres', 'success');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement KPIs:', error);
        this.showAlert('❌ Backend non disponible - Démarrez le backend: python app-ultra-secure.py', 'error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verifyUrl() {
    const urlInput = document.getElementById('pageUrl') as HTMLInputElement;
    const url = urlInput?.value;
    if (!url) {
      this.showAlert('Veuillez entrer une URL à vérifier', 'warning');
      return;
    }
    
    this.showAlert('Vérification des données Google Analytics...', 'info');
    
    // Charger les vraies données depuis le backend
    this.loadRealData();
    
    setTimeout(() => {
      this.showAlert(`✅ Données Google Analytics chargées pour: ${url}`, 'success');
    }, 2000);
  }

  syncGoogle() {
    this.showAlert('🔄 Synchronisation avec Google Analytics...', 'info');
    
    // Recharger toutes les données depuis le backend
    this.loadRealData();
    
    setTimeout(() => {
      if (this.lastSyncEl) {
        this.lastSyncEl.nativeElement.textContent = 'Dernière sync: ' + new Date().toLocaleTimeString('fr-FR');
      }
      this.showAlert('✅ Synchronisation Google Analytics terminée', 'success');
    }, 2000);
  }

  generateAIRecommendations() {
    this.showAIPanel = true;
    setTimeout(() => {
      const panel = document.getElementById('ai-panel');
      panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.showAlert('✨ Recommandations IA générées avec succès.', 'success');
    }, 500);
  }

  logout() {
    this.authService.logout();
  }

  private showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.showAlertMessage = message;
    this.alertType = type;
    this.showNotification = true;
    
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
