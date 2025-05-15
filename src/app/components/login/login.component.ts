import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isDarkMode = false;
  submitted = false;
  showPassword = false;
  loginError = false;
  errorMessage = ''; // Add this property for error messages

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Rename login() to onSubmit() to match the template
  onSubmit(): void {
    this.submitted = true;
    this.loginError = false;

    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Resposta login:', response);

          // Remove this redundant code - AuthService already handles token storage
          // if (response && response.access_token) {
          //   localStorage.setItem('auth_token', response.access_token);
          //   this.authService.saveToken(response.access_token);
          //   console.log('Token guardat:', response.access_token.substring(0, 10) + '...');
          // }

          // Check user role and redirect accordingly
          const user = this.authService.getCurrentUser();
          console.log('User role:', user?.rol);

          if (user && user.rol && user.rol.toLowerCase() === 'vendedor') {
            console.log('Redirecting to vendor dashboard');
            this.router.navigate(['/vendedor']);
          } else {
            console.log('Redirecting to home page');
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error de login:', error);
          this.loginError = true;
        }
      });
    }
  }

  // Helper methods for form validation
  get f() { return this.loginForm.controls; }
}
