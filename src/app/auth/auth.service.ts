import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const storedAuth = localStorage.getItem('isAuthenticated');
    if (storedAuth === 'true') {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulation d'appel API - remplacer par vrai appel API
      setTimeout(() => {
        // Simulation de validation (accepter n'importe quel email/password pour la démo)
        if (email && password) {
          this.isAuthenticatedSubject.next(true);
          localStorage.setItem('isAuthenticated', 'true');
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
  }

  getCurrentAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
