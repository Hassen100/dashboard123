import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  timestamp = new Date().toLocaleString('fr-FR');

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

  topPages = [
    { url: '/accueil', views: '8,234', trend: 'up', trendIcon: '↑', trendPercent: '12.5' },
    { url: '/services', views: '5,892', trend: 'up', trendIcon: '↑', trendPercent: '8.3' },
    { url: '/blog/seo-tips', views: '3,456', trend: 'flat', trendIcon: '→', trendPercent: '0.5' },
    { url: '/contact', views: '2,123', trend: 'down', trendIcon: '↓', trendPercent: '3.2' }
  ];

  topKeywords = [
    { term: 'audit seo gratuit', position: '3', ctr: '28.5' },
    { term: 'referencement site', position: '7', ctr: '19.2' },
    { term: 'optimisation seo', position: '5', ctr: '22.1' },
    { term: 'consultant seo paris', position: '12', ctr: '15.8' }
  ];

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

  constructor() {}

  ngOnInit() {
    this.initCharts();
  }

  ngAfterViewInit() {
    // Initialize charts after view is ready
    setTimeout(() => {
      this.initCharts();
    }, 100);
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
    const labels = this.genDates(days);
    const sessions = Array.from({length:days}, () => this.randomBetween(800, 3200));
    const organic = sessions.map(s => Math.floor(s * (.55 + Math.random() * .2)));

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
    this.showAlert('⚡ Filtres appliqués avec succès.', 'success');
    this.updateData();
  }

  verifyUrl() {
    const urlInput = document.getElementById('pageUrl') as HTMLInputElement;
    const url = urlInput?.value?.trim();
    if (!url) { 
      this.showAlert('Veuillez saisir une URL.', 'error'); 
      return; 
    }
    try { 
      new URL(url); 
      this.showAlert('✓ URL valide.', 'success'); 
    } catch { 
      this.showAlert('✗ URL invalide. Format: https://example.com/page', 'error'); 
    }
  }

  syncGoogle() {
    this.showAlert('🔄 Synchronisation Google Analytics & Search Console effectuée.', 'info');
    document.getElementById('last-sync')!.textContent = 'Dernière sync: ' + new Date().toLocaleTimeString('fr-FR');
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

  private updateData() {
    // Update KPIs with random variations
    this.kpiData.sessions = (this.randomBetween(10000, 15000)).toLocaleString('fr-FR');
    this.kpiData.users = (this.randomBetween(6000, 9000)).toLocaleString('fr-FR');
    this.kpiData.pageviews = (this.randomBetween(35000, 50000)).toLocaleString('fr-FR');
    this.kpiData.bounceRate = (this.randomBetween(35, 55)).toFixed(1);
    
    // Reinitialize charts with new data
    this.initCharts();
  }

  private showAlert(message: string, type: 'success' | 'error' | 'info') {
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
