import { Component, AfterViewInit, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import L from 'leaflet';
import { MapDataService } from '../../../services/map-data.service';
import { ReportI } from '../../../models/report.model';
import { Observable } from 'rxjs';

interface Report {
  id: number;
  lat: number;
  lng: number;
  category: string;
  description: string;
}

@Component({
  selector: 'app-map-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './map-view.html',
  styleUrl: './map-view.css'
})
export class MapView implements OnInit, AfterViewInit {
  private map!: L.Map;
  private markers: { [key: number]: L.Marker } = {};

  // Propiedades para manejar el estado de la UI
  public isModalVisible = false;
  public isSuccessVisible = false;

  // Datos de la aplicación (eventualmente vendrán de un servicio)
  public reports$!: Observable<ReportI[]>;

  public categories: { [key: string]: { color: string; name: string; icon: string } } = {
    seguridad: { color: '#EF4444', name: 'Seguridad', icon: '🛡️' },
    salud: { color: '#22C55E', name: 'Salud', icon: '⚕️' },
    transporte: { color: '#EAB308', name: 'Transporte', icon: '🚌' },
    'espacio-publico': { color: '#8B5CF6', name: 'Espacio Público', icon: '🌳' },
    otro: { color: '#6B7280', name: 'Otro', icon: '❓' }
  };

  // Propiedades para el formulario
  public newReportData = {
    category: 'seguridad',
    description: '',
    lat: 0,
    lng: 0
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private mapService: MapDataService) {}

  ngOnInit(): void {
    this.getReports();
  }

  ngAfterViewInit(): void {
    // Solo inicializa el mapa si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
      this.loadInitialReports();
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([4.5339, -75.6811], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.openModal(e.latlng);
    });
  }

  private loadInitialReports(): void {
    this.mapService.reports$.subscribe(reports => {
      this.updateMapMarkers(reports);
    });
  }

  private updateMapMarkers(reports: Report[]): void {
    // Limpia marcadores antiguos
    Object.values(this.markers).forEach(marker => marker.remove());
    this.markers = {};
    // Añade los nuevos
    reports.forEach(report => this.addReportToMap(report));
  }

  public openModal(latlng: L.LatLng): void {
    this.newReportData.lat = latlng.lat;
    this.newReportData.lng = latlng.lng;
    this.isModalVisible = true;
  }

  public closeModal(): void {
    this.isModalVisible = false;
  }

  public handleFormSubmit(): void {
    const reportData: Omit<Report, 'id' | 'created_at'> = { ...this.newReportData };

    this.mapService.addReport(reportData).subscribe({
      next: () => {
        this.closeModal();
        this.showSuccessNotification();
        this.getReports();
      },
      error: (err) => {
        alert('Hubo un error al guardar el reporte. Revisa la consola para más detalles.');
      }
    });
  }

  private addReportToMap(report: Report): void {
    const catInfo = this.categories[report.category] || this.categories['otro'];
    const iconHtml = `<div style="background-color: ${catInfo.color};" class="w-8 h-8 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white dark:border-gray-800">${catInfo.icon}</div>`;
    const customIcon = L.divIcon({ html: iconHtml, className: 'bg-transparent', iconSize: [32, 32], iconAnchor: [16, 16] });

    const marker = L.marker([report.lat, report.lng], { icon: customIcon }).addTo(this.map);
    marker.bindPopup(`<b>${catInfo.name}</b><br>${report.description}`);
    this.markers[report.id] = marker;
  }
  
  private showSuccessNotification(): void {
    this.isSuccessVisible = true;
    setTimeout(() => {
        this.isSuccessVisible = false;
    }, 3000);
  }

  private getReports(): void {
      // Asigna el Observable del servicio a la propiedad local
      this.reports$ = this.mapService.reports$;
      // Pide al servicio que cargue los datos iniciales
      this.mapService.loadInitialReports();
  }
}
