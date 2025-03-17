import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  recoveryForm!: FormGroup;
  isDarkMode = false;
  submitted = false;
  recoveryMessage = '';
  recoverySuccess = false;
  resetLink: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  onSubmit(): void {
    this.submitted = true;
    this.recoveryMessage = '';
    this.resetLink = null;
    
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.value.email;
      
      // Check if the email exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((user: any) => user.email === email);
      
      if (userExists || email === 'test@example.com') {
        // Generate a reset token
        const resetToken = Math.random().toString(36).substring(2, 15);
        const resetRequests = JSON.parse(localStorage.getItem('passwordResets') || '[]');
        
        // Remove any existing requests for this email
        const filteredRequests = resetRequests.filter((req: any) => req.email !== email);
        
        // Add new request
        filteredRequests.push({
          email: email,
          token: resetToken,
          expires: new Date(Date.now() + 3600000).toISOString() // 1 hour expiry
        });
        
        localStorage.setItem('passwordResets', JSON.stringify(filteredRequests));
        
        this.recoverySuccess = true;
        this.recoveryMessage = 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.';
        
        // For demo purposes, provide a reset link
        this.resetLink = `/reset-password?token=${resetToken}`;
        
        // In a real app, you would send an email with this link
        console.log(`Reset link: ${window.location.origin}${this.resetLink}`);
      } else {
        this.recoverySuccess = false;
        this.recoveryMessage = 'No existe ninguna cuenta con este correo electrónico.';
      }
    }
  }
  
  // Helper methods for form validation
  get f() { return this.recoveryForm.controls; }
}
