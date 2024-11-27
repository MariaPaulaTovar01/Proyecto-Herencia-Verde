import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private csvPaths: string[] = [
    'assets/csv/01renewable-share-energy.csv',
    'assets/csv/02modern-renewable-energy-consumption.csv',
    'assets/csv/03modern-renewable-prod.csv',
    'assets/csv/04share-electricity-renewables.csv',
    'assets/csv/05hydropower-consumption.csv',
    'assets/csv/06hydro-share-energy.csv',
    'assets/csv/07share-electricity-hydro.csv',
    'assets/csv/08wind-generation.csv',
    'assets/csv/09cumulative-installed-wind-energy-capacity-gigawatts.csv',
    'assets/csv/10wind-share-energy.csv',
    'assets/csv/11share-electricity-wind.csv',
    'assets/csv/12solar-energy-consumption.csv',
    'assets/csv/13installed-solar-PV-capacity.csv',
    'assets/csv/14solar-share-energy.csv',
    'assets/csv/15share-electricity-solar.csv',
    'assets/csv/16biofuel-production.csv',
    'assets/csv/17installed-geothermal-capacity.csv',
  ];

  private originalData: any[] = [];

  constructor(private http: HttpClient) {}

  getCsvData(): Observable<any[]> {
    const requests = this.csvPaths.map((path) =>
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


  // Método para cargar únicamente el primer archivo CSV
  getFirstCsvData(): Observable<any[]> {
    const firstPath = this.csvPaths[0]; // Toma el primer archivo
    return this.http.get(firstPath, { responseType: 'text' }).pipe(
      map((response: string) => {
        const data = this.csvToJson(response);
        this.originalData = data; // Guardar solo los datos del primer archivo
        return data;
      }),
      catchError((error) => {
        console.error('Error al cargar el primer archivo CSV:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

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

  getOriginalData(): any[] {
    return this.originalData; // Retorna los datos originales
  }
}
