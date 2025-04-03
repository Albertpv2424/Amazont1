import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-confirmacion-compra',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmacion-compra.component.html',
  styleUrls: ['./confirmacion-compra.component.css']
})
export class ConfirmacionCompraComponent implements OnInit {
  exito: boolean = false;
  total: number = 0;
  isDarkMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.exito = params['success'] === 'true';
      this.total = Number(params['total'] || 0);
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  volverAInicio(): void {
    this.router.navigate(['/']);
  }
}
