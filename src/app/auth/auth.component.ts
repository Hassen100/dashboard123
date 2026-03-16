import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  authForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {}

  get email(): AbstractControl {
    return this.authForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.authForm.get('password')!;
  }

  get fullName(): AbstractControl {
    return this.authForm.get('fullName')!;
  }

  get confirmPassword(): AbstractControl {
    return this.authForm.get('confirmPassword')!;
  }

  switchMode(mode: 'login' | 'signup'): void {
    this.isLoginMode = mode === 'login';
    this.authForm.reset();
    
    // Clear validation for signup-only fields when switching to login
    if (this.isLoginMode) {
      this.fullName.setValidators([]);
      this.confirmPassword.setValidators([]);
    } else {
      this.fullName.setValidators([Validators.required]);
      this.confirmPassword.setValidators([Validators.required]);
    }
    
    this.fullName.updateValueAndValidity();
    this.confirmPassword.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      this.markFormGroupTouched(this.authForm);
      return;
    }

    this.isLoading = true;

    if (this.isLoginMode) {
      // Utiliser le service d'authentification
      this.authService.login(this.email.value, this.password.value)
        .then((success) => {
          this.isLoading = false;
          if (success) {
            console.log('Connexion réussie:', {
              email: this.email.value
            });
            // La redirection se fait automatiquement via le AppComponent
            this.authForm.reset();
          } else {
            alert('Échec de la connexion. Vérifiez vos identifiants.');
          }
        })
        .catch((error) => {
          this.isLoading = false;
          console.error('Erreur de connexion:', error);
          alert('Erreur lors de la connexion.');
        });
    } else {
      // Simulation d'inscription
      setTimeout(() => {
        this.isLoading = false;
        console.log('Signup attempt:', {
          fullName: this.fullName.value,
          email: this.email.value,
          password: this.password.value
        });
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        this.switchMode('login');
      }, 1500);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (control?.errors && control.touched) {
      const errors = control.errors;
      
      if (errors['required']) {
        return `${fieldName} est requis`;
      }
      
      if (errors['email']) {
        return 'Veuillez entrer une adresse email valide';
      }
      
      if (errors['minlength']) {
        return `Le mot de passe doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
      }
      
      if (errors['passwordMismatch']) {
        return 'Les mots de passe ne correspondent pas';
      }
    }
    
    return '';
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.root.get('password')?.value;
    const confirmPassword = control.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePassword(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  forgotPassword(): void {
    alert('Fonctionnalité de mot de passe oublié (Simulation)');
  }
}
