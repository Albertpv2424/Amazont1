import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../interfaces/usuario.interface';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  isDarkMode = false;
  submitted = false;
  registrationError = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      tipoUsuario: ['Cliente', Validators.required],
      aceptaTerminos: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const confirmPasswordControl = control.get('confirmPassword');
      if (confirmPasswordControl?.errors) {
        const errors = { ...confirmPasswordControl.errors };
        delete errors['passwordMismatch'];
        
        confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.registrationError = '';
  
    if (this.registroForm.valid) {
      const user: Usuario = {
        nombre: this.registroForm.value.nombre,
        email: this.registroForm.value.email,
        contraseña: this.registroForm.value.password,
        contraseña_confirmation: this.registroForm.value.confirmPassword,
        rol: this.registroForm.value.tipoUsuario,
        aceptaTerminos: false
      };
      console.log('User object being sent:', user);

      this.authService.register(user).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.registrationError = 'El correo electrónico ya está registrado o los datos son incorrectos';
          } else {
            this.registrationError = 'Error en el registro. Inténtalo de nuevo.';
          }
        }
      });
    }
  }

  get f() { return this.registroForm.controls; }
}