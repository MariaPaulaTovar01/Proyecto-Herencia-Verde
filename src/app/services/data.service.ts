import { Injectable } from '@angular/core';
import * as Papa from 'papaparse';
import { RenewableData } from '../interface/RenewableData';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private rawData: RenewableData[] = []; // Almacena los datos originales cargados del CSV

  constructor() {}

  /**
   * Carga y procesa un archivo CSV.
   * @param file Archivo CSV seleccionado por el usuario.
   * @returns Una promesa con los datos procesados.
   */
  loadCSV(file: File): Promise<RenewableData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true, // Interpretar la primera fila como encabezados
        skipEmptyLines: true, // Ignorar líneas vacías
        complete: (result) => {
          this.rawData = result.data.map((row: any) => ({
            entity: row['Entity'] || '',
            code: row['Code'] || null,
            year: +row['Year'], // Convertir a número
            renewables: +row['Renewables (% equivalent primary energy)'], // Convertir a número
          }));
          resolve(this.rawData);
        },
        error: (error) => reject(error),
      });
    });
  }

  /**
   * Obtiene todos los datos cargados.
   * @returns Array con los datos originales.
   */
  getData(): RenewableData[] {
    return this.rawData;
  }

  /**
   * Filtra los datos por una región específica (Entity).
   * @param region Nombre de la región a filtrar.
   * @returns Array filtrado por región.
   */
  filterByRegion(region: string): RenewableData[] {
    return this.rawData.filter((row) =>
      row.entity.toLowerCase().includes(region.toLowerCase())
    );
  }

  /**
   * Filtra los datos por un rango de años.
   * @param startYear Año inicial del rango.
   * @param endYear Año final del rango.
   * @returns Array filtrado por rango de años.
   */
  filterByYearRange(startYear: number, endYear: number): RenewableData[] {
    return this.rawData.filter(
      (row) => row.year >= startYear && row.year <= endYear
    );
  }

  /**
   * Ordena los datos por una columna específica.
   * @param column Nombre de la columna a ordenar.
   * @param direction Dirección de orden: 'asc' (ascendente) o 'desc' (descendente).
   * @returns Array ordenado.
   */
  sortData(column: keyof RenewableData, direction: 'asc' | 'desc'): RenewableData[] {
    return [...this.rawData].sort((a, b) => {
      if (a[column]! < b[column]!) return direction === 'asc' ? -1 : 1;
      if (a[column]! > b[column]!) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /**
   * Calcula el promedio de energía renovable por región.
   * @param region Región específica para calcular el promedio.
   * @returns Promedio de energía renovable para la región.
   */
  calculateAverageRenewables(region: string): number {
    const filteredData = this.filterByRegion(region);
    const total = filteredData.reduce(
      (sum, row) => sum + row.renewables,
      0
    );
    return filteredData.length ? total / filteredData.length : 0;
  }
}
