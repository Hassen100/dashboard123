import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      fullName: [''],
      confirmPassword: ['']
    });
  }

  ngOnInit(): void {
    // Set up password match validator for signup
    this.confirmPassword.valueChanges.subscribe(() => {
      if (!this.isLoginMode && this.confirmPassword.value) {
        this.confirmPassword.setValidators([
          Validators.required,
          this.passwordMatchValidator()
        ]);
        this.confirmPassword.updateValueAndValidity();
      }
    });
  }

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
      this.confirmPassword.setValidators([
        Validators.required,
        this.passwordMatchValidator()
      ]);
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

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      
      if (this.isLoginMode) {
        console.log('Login attempt:', {
          email: this.email.value,
          password: this.password.value
        });
        alert('Connexion réussie ! (Simulation)');
      } else {
        console.log('Signup attempt:', {
          fullName: this.fullName.value,
          email: this.email.value,
          password: this.password.value
        });
        alert('Inscription réussie ! (Simulation)');
      }
      
      this.authForm.reset();
    }, 1500);
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

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.root.get('password')?.value;
      const confirmPassword = control.value;
      
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
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
