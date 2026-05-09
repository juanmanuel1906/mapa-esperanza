import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MapDataService } from '../../../services/map-data.service';
import { ReportI } from '../../../models/report.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar implements OnInit {

  public isDarkMode = false;
  public reports$!: Observable<ReportI[]>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapService: MapDataService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
    }
    // Asigna el Observable del servicio a la propiedad local
    this.reports$ = this.mapService.reports$;
    // Pide al servicio que cargue los datos iniciales
    this.mapService.loadInitialReports();
  }

  private initializeTheme(): void {
    if (
      localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
  }

  public toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
  }
}