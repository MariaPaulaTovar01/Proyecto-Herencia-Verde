import { Injectable } from '@angular/core';

export interface EnergyData {
  Entity: string;
  Code?: string;
  Year: number | string; // Puede ser número o string
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CalculationService {
  constructor() {}

  // Convertir string a número (retorna 0 si no es convertible)
  private toNumber(value: any): number {
    return isNaN(Number(value)) ? 0 : Number(value);
  }

  // Obtener valores únicos de una columna
  getUniqueValues(data: EnergyData[], column: string): string[] | number[] {
    return Array.from(new Set(data.map((item) => item[column]))).map((value) => {
      return column === 'Year' ? this.toNumber(value) : value;
    }).filter((value) => value);
  }

  // Filtrar datos por región y año
  filterData(data: EnergyData[], region: string, year: number): EnergyData[] {
    return data.filter((item) => item.Entity === region && this.toNumber(item.Year) === year);
  }

  // Función para obtener las regiones únicas
  getUniqueRegions(data: EnergyData[]): string[] {
    return this.getUniqueValues(data, 'Entity') as string[];
  }

  // Función para obtener los años únicos
  getUniqueYears(data: EnergyData[]): number[] {
    return this.getUniqueValues(data, 'Year') as number[];
  }

  // Métodos adicionales para gráficos
  getProductionDataForBarChart(data: EnergyData[]): number[] {
    return [
      this.toNumber(data.find((item) => item['Electricity from wind (TWh)'])?.['Electricity from wind (TWh)']),
      this.toNumber(data.find((item) => item['Electricity from solar (TWh)'])?.['Electricity from solar (TWh)']),
      this.toNumber(data.find((item) => item['Electricity from hydro (TWh)'])?.['Electricity from hydro (TWh)']),
      this.toNumber(data.find((item) => item['Biofuels Production - TWh - Total'])?.['Biofuels Production - TWh - Total']),
      this.toNumber(data.find((item) => item['Geothermal Capacity'])?.['Geothermal Capacity']),
    ];
  }

  getRenewablesShareForPieChart(data: EnergyData[]): number[] {
    return [
      this.toNumber(data.find((item) => item['Wind (% electricity)'])?.['Wind (% electricity)']),
      this.toNumber(data.find((item) => item['Solar (% electricity)'])?.['Solar (% electricity)']),
      this.toNumber(data.find((item) => item['Hydro (% electricity)'])?.['Hydro (% electricity)']),
    ];
  }

  getInstalledCapacityForLineChart(data: EnergyData[]): any {
    const years = this.getUniqueValues(data, 'Year') as number[];
    return {
      labels: years,
      wind: years.map((year) =>
        this.toNumber(data.find((item) => this.toNumber(item.Year) === year)?.['Wind Capacity'])
      ),
      solar: years.map((year) =>
        this.toNumber(data.find((item) => this.toNumber(item.Year) === year)?.['Solar Capacity'])
      ),
      geothermal: years.map((year) =>
        this.toNumber(data.find((item) => this.toNumber(item.Year) === year)?.['Geothermal Capacity'])
      ),
    };
  }

  filterDataByRegionAndYear(data: EnergyData[], region: string, year: number): EnergyData[] {
    return data.filter(item => item.Entity === region && item.Year === year);
  }

  getEnergyConsumptionComparisonForAreaChart(data: EnergyData[]): any {
    const years = this.getUniqueValues(data, 'Year') as number[];
    return {
      labels: years,
      renewable: years.map((year) =>
        this.toNumber(data.find((item) => this.toNumber(item.Year) === year)?.['Geo Biomass Other - TWh'])
      ),
      conventional: years.map((year) =>
        this.toNumber(data.find((item) => this.toNumber(item.Year) === year)?.['Conventional Energy Consumption (TWh)'])
      ),
    };
  }
}
