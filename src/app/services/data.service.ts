import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private csvPath = 'assets/csv/01renewable-share-energy.csv';
  private originalData: any[] = []; // Almacenar los datos originales

  constructor(private http: HttpClient) {}

  getCsvData(): Observable<any[]> {
    console.log(`Intentando cargar archivo CSV desde: ${this.csvPath}`);

    return this.http.get(this.csvPath, { responseType: 'text' }).pipe(
      map((data) => {
        console.log('Archivo CSV cargado con éxito.');
        const jsonData = this.csvToJson(data);
        this.originalData = jsonData; // Guardamos los datos originales
        return jsonData;
      }),
      catchError((error) => {
        console.error('Error al cargar el archivo CSV:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  getOriginalData(): any[] {
    return [...this.originalData]; // Devuelve una copia de los datos originales
  }

  private csvToJson(csv: string): any[] {
    try {
      const lines = csv.split('\n').filter((line) => line.trim().length > 0); // Elimina líneas vacías
      const headers = lines[0].split(',').map((header) => header.trim());
      const data = lines.slice(1).map((line) => {
        const values = line.split(',').map((value) => value.trim());
        return headers.reduce((acc, header, index) => {
          acc[header] = values[index] || null; // Asigna null si el valor no existe
          return acc;
        }, {} as any);
      });
      console.log('Datos procesados desde el CSV:', data);
      return data;
    } catch (error) {
      console.error('Error al procesar el archivo CSV:', error);
      return [];
    }
  }
}
