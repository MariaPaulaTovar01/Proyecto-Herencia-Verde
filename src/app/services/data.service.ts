import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly renewableSharePath = 'assets/csv/01renewable-share-energy.csv'; // Ruta específica para el archivo de "Renewable Share"
  private originalData: any[] = [];

  private csvPaths: { [key: string]: string[] } = {
    // Archivos necesarios para cada gráfico
    barChart: [
      'assets/csv/03modern-renewable-prod.csv',
      'assets/csv/16biofuel-production.csv',
      'assets/csv/17installed-geothermal-capacity.csv',
    ],
    pieChart: [
      'assets/csv/03modern-renewable-prod.csv',
      'assets/csv/12solar-energy-consumption.csv',
      'assets/csv/08wind-generation.csv',
      'assets/csv/05hydropower-consumption.csv',
    ],
    lineChart: [
      'assets/csv/09cumulative-installed-wind-energy-capacity-gigawatts.csv',
      'assets/csv/13installed-solar-PV-capacity.csv',
      'assets/csv/17installed-geothermal-capacity.csv',
    ],
    areaChart: [
      'assets/csv/02modern-renewable-energy-consumption.csv',
      'assets/csv/05hydropower-consumption.csv',
      'assets/csv/08wind-generation.csv',
      'assets/csv/12solar-energy-consumption.csv',
      'assets/csv/16biofuel-production.csv',
    ],
  };

  constructor(private http: HttpClient) {}

  /**
   * Cargar datos del archivo específico `01renewable-share-energy.csv`
   */
  getRenewableShareData(): Observable<any[]> {
    return this.http.get(this.renewableSharePath, { responseType: 'text' }).pipe(
      map((response: string) => {
        const data = this.csvToJson(response);
        this.originalData = data;
        return data;
      }),
      catchError((error) => {
        console.error('Error al cargar el archivo CSV:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  /**
   * Cargar datos necesarios para gráficos basados en el tipo de gráfico
   */
  getCsvDataForChart(chartType: string): Observable<any[]> {
    const paths = this.csvPaths[chartType];
    if (!paths) {
      return of([]); // Si no se encuentra el tipo de gráfico, retorna un array vacío
    }

    const requests = paths.map((path) =>
      this.http.get(path, { responseType: 'text' })
    );

    return forkJoin(requests).pipe(
      map((responses: string[]) => {
        const allData = responses.map((response) => this.csvToJson(response));
        this.originalData = allData.flat();
        return this.originalData;
      }),
      catchError((error) => {
        console.error('Error al cargar los archivos CSV:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  /**
   * Convertir datos en formato CSV a JSON
   */
  private csvToJson(csv: string): any[] {
    const lines = csv.split('\n').filter((line) => line.trim().length > 0);
    const headers = lines[0].split(',').map((header) => header.trim());
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((value) => value.trim());
      return headers.reduce((acc, header, index) => {
        acc[header] = values[index] || null;
        return acc;
      }, {} as any);
    });
  }

  /**
   * Obtener los datos originales cargados por el servicio
   */
  getOriginalData(): any[] {
    return this.originalData;
  }
}
