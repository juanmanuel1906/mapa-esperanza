import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReportI } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})

export class MapDataService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reports`;

  // BehaviorSubject para mantener la lista de reportes y emitir actualizaciones.
  private reportsSubject = new BehaviorSubject<ReportI[]>([]);
  public reports$ = this.reportsSubject.asObservable();

  /**
   * Carga los reportes iniciales desde la API y los emite al BehaviorSubject.
   */
  loadInitialReports(): void {
    this.http.get<ReportI[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error("Error al cargar los reportes desde la API", err);
        return throwError(() => err);
      })
    ).subscribe(reports => {
      this.reportsSubject.next(reports);
    });
  }

  /**
   * Envía un nuevo reporte a la API y, si tiene éxito, actualiza la lista local
   * para una respuesta instantánea en la UI.
   */
  addReport(reportData: Omit<ReportI, 'id' | 'created_at'>): Observable<ReportI> {
    return this.http.post<ReportI>(this.apiUrl, reportData).pipe(
      tap(newReportFromServer => {
        // Una vez guardado en la BD, actualiza la lista local y notifica a todos.
        const currentReports = this.reportsSubject.getValue();
        this.reportsSubject.next([newReportFromServer, ...currentReports]);
      }),
      catchError(err => {
        console.error("Error al guardar el reporte en la API", err);
        return throwError(() => err);
      })
    );
  }
}