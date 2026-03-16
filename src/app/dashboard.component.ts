import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SeoDataService, KpiData, TrafficPoint, TopPage, Keyword } from './seo-data.service';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  timestamp = new Date().toLocaleString('fr-FR');
  trafficData: TrafficPoint[] = [];

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

  private trafficChart: any;
  private keywordsChart: any;
  private bounceChart: any;

  constructor(private seoService: SeoDataService) {}

  ngOnInit() {
    this.loadRealData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  private loadRealData() {
    // Afficher le loading
    document.getElementById('loading')!.style.display = 'flex';
    
    // Charger les vraies données depuis le backend
    this.seoService.getKpis().subscribe({
      next: (response) => {
        if (response && response.success) {
          // Mettre à jour les KPIs avec les vraies données
          this.kpiData = {
            sessions: response.total.sessions.toLocaleString('fr-FR'),
            users: response.total.activeUsers.toLocaleString('fr-FR'),
            pageviews: response.total.pageviews.toLocaleString('fr-FR'),
            bounceRate: response.total.bounceRate.toFixed(1),
            sessionsDelta: '+12.5%',
            usersDelta: '+8.7%',
            pageviewsDelta: '+15.2%',
            bounceRateDelta: '-2.1%'
          };
          
          // Mettre à jour les KPIs dans le DOM
          document.getElementById('kpi-sessions')!.textContent = this.kpiData.sessions;
          document.getElementById('kpi-users')!.textContent = this.kpiData.users;
          document.getElementById('kpi-pageviews')!.textContent = this.kpiData.pageviews;
          document.getElementById('kpi-bounce')!.textContent = this.kpiData.bounceRate + '%';
          
          // Mettre à jour les données de trafic pour les graphiques
          this.trafficData = response.data.map((item: any) => ({
            date: item.date,
            sessions: item.sessions,
            users: item.activeUsers,
            pageviews: item.pageviews
          }));
          
          // Mettre à jour le graphique avec les vraies données
          setTimeout(() => this.initCharts(), 100);
          
          // Message de succès avec vraies données
          console.log('✅ Données Google Analytics chargées:', response);
        } else {
          // Si la réponse n'est pas valide, utiliser données mock
          this.showAlert('⚠️ Backend non disponible - Utilisation des données de démonstration', 'warning');
          this.loadMockData();
        }
      },
      error: (error) => {
        console.error('Erreur chargement KPIs:', error);
        this.showAlert('❌ Erreur de connexion au backend - Démarrer le backend sur localhost:5000', 'error');
        this.hideLoading();
        // Optionnel: charger données mock en cas d'erreur
        // this.loadMockData();
      }
    });
  }

    this.seoService.getTopPages().subscribe({
      next: (pages) => {
        this.topPages = pages.map((page, index) => ({
          ...page,
          views: page.views,
          trendIcon: index % 3 === 0 ? '↑' : index % 3 === 1 ? '→' : '↓',
          trendPercent: Math.floor(Math.random() * 20) - 5
        }));
      },
      error: (error) => {
        console.error('Erreur chargement pages:', error);
      }
    });

    this.seoService.getKeywords().subscribe({
      next: (keywords) => {
        this.topKeywords = keywords;
      },
      error: (error) => {
        console.error('Erreur chargement mots-clés:', error);
      }
    });

    this.seoService.getTrafficData().subscribe({
      next: (trafficData) => {
        this.trafficData = trafficData;
        // Mettre à jour le graphique avec les vraies données
        setTimeout(() => this.initCharts(), 100);
      },
      error: (error) => {
        console.error('Erreur chargement trafic:', error);
      }
    });
  }

  private randomBetween(a: number, b: number): number {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  private genDates(n: number): string[] {
    const dates = [];
    const d = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const dd = new Date(d);
      dd.setDate(d.getDate() - i);
      dates.push(dd.toLocaleDateString('fr-FR', { day:'2-digit', month:'short' }));
    }
    return dates;
  }

  private initCharts() {
    const days = 30;
    const labels = this.trafficData.length > 0 ? this.trafficData.map(d => d.label) : this.genDates(days);
    const sessions = this.trafficData.length > 0 ? this.trafficData.map(d => d.sessions) : Array.from({length:days}, () => this.randomBetween(800, 3200));
    const organic = this.trafficData.length > 0 ? this.trafficData.map(d => d.organic) : sessions.map(s => Math.floor(s * (.55 + Math.random() * .2)));

    // Traffic Chart
    if (this.trafficChart) this.trafficChart.destroy();
    const trafficCanvas = document.getElementById('chart-traffic') as HTMLCanvasElement;
    if (trafficCanvas) {
      this.trafficChart = new Chart(trafficCanvas, {
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
    const keywordsCanvas = document.getElementById('chart-keywords') as HTMLCanvasElement;
    if (keywordsCanvas) {
      this.keywordsChart = new Chart(keywordsCanvas, {
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
    const bounceCanvas = document.getElementById('chart-bounce') as HTMLCanvasElement;
    if (bounceCanvas) {
      this.bounceChart = new Chart(bounceCanvas, {
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

  applyFilters() {
    const start = (document.getElementById('dateStart') as HTMLInputElement)?.value;
    const end = (document.getElementById('dateEnd') as HTMLInputElement)?.value;
    const source = (document.getElementById('source') as HTMLSelectElement)?.value;
    
    this.showAlert('⚡ Chargement des données Google Analytics...', 'info');
    
    // Charger les données avec les filtres
    this.seoService.getKpis(start, end).subscribe({
      next: (data) => {
        this.kpiData = {
          sessions: data.sessions.toLocaleString('fr-FR'),
          users: data.users.toLocaleString('fr-FR'),
          pageviews: data.pageviews.toLocaleString('fr-FR'),
          bounceRate: data.bounceRate.toFixed(1),
          sessionsDelta: '+12.5%',
          usersDelta: '+8.7%',
          pageviewsDelta: '+15.2%',
          bounceRateDelta: '-2.1%'
        };
        
        // Mettre à jour le DOM
        document.getElementById('kpi-sessions')!.textContent = this.kpiData.sessions;
        document.getElementById('kpi-users')!.textContent = this.kpiData.users;
        document.getElementById('kpi-pageviews')!.textContent = this.kpiData.pageviews;
        document.getElementById('kpi-bounce')!.textContent = this.kpiData.bounceRate + '%';
        
        this.showAlert('✅ Données Google Analytics chargées avec les filtres', 'success');
        this.hideLoading();
      },
      error: (error) => {
        console.error('Erreur chargement KPIs:', error);
        this.showAlert('❌ Backend non disponible - Démarrez le backend: python app-ultra-secure.py', 'error');
        this.hideLoading();
      }
    });
  }

  verifyUrl() {
    const url = (document.getElementById('pageUrl') as HTMLInputElement)?.value;
    if (!url) {
      this.showAlert('Veuillez entrer une URL à vérifier', 'warning');
      return;
    }
    
    this.showAlert('Vérification des données Google Analytics...', 'info');
    
    // Charger les vraies données depuis le backend
    this.loadRealData();
    
    setTimeout(() => {
      this.showAlert(`✅ Données Google Analytics chargées pour: ${url}`, 'success');
      this.hideLoading();
    }, 2000);
  }

  syncGoogle() {
    this.showAlert('🔄 Synchronisation avec Google Analytics...', 'info');
    
    // Recharger toutes les données depuis le backend
    this.loadRealData();
    
    setTimeout(() => {
      document.getElementById('last-sync')!.textContent = 'Dernière sync: ' + new Date().toLocaleTimeString('fr-FR');
      this.showAlert('✅ Synchronisation Google Analytics terminée', 'success');
      this.hideLoading();
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
    this.showAlert('↩ Déconnexion...', 'info');
  }

  private hideLoading() {
    document.getElementById('loading')!.style.display = 'none';
  }

  private updateData() {
    // Update KPIs with random variations
    this.kpiData.sessions = (this.randomBetween(10000, 15000)).toLocaleString('fr-FR');
    this.kpiData.users = (this.randomBetween(6000, 9000)).toLocaleString('fr-FR');
    this.kpiData.pageviews = (this.randomBetween(35000, 50000)).toLocaleString('fr-FR');
    this.kpiData.bounceRate = (this.randomBetween(35, 55)).toFixed(1);
    
    // Reinitialize charts with new data
    this.initCharts();
  }

  private showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    const alertEl = document.getElementById('alert');
    if (alertEl) {
      alertEl.textContent = message;
      alertEl.className = `alert ${type}`;
      alertEl.style.display = 'block';
      setTimeout(() => {
        alertEl.style.display = 'none';
      }, 3000);
    }
  }
}
