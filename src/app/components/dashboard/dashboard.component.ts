import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CalculationService } from '../../services/calculation.service';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public charts: Record<string, Chart<any, any[], any> | null> = {};
  public filter: { region: string; year: number | null } = { region: '', year: null };
  public regions: string[] = [];
  public years: number[] = [];
  public csvData: any[] = [];

  constructor(
    private dataService: DataService,
    private calculationService: CalculationService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    console.log('ngOnInit: Cargando datos iniciales');
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy: Destruyendo gráficos');
    this.destroyCharts();
  }

  loadInitialData(): void {
    console.log('loadInitialData: Cargando datos CSV...');
    this.dataService.getCsvData().subscribe(
      (data) => {
        console.log('Datos CSV recibidos:', data);
        this.csvData = data;
        this.regions = this.calculationService.getUniqueRegions(data).map((region) => region.trim());
        this.years = this.calculationService.getUniqueYears(data).map((year) => Number(year));
        console.log('Regiones disponibles:', this.regions);
        console.log('Años disponibles:', this.years);

        this.updateCharts(); // Cargar gráficos con datos iniciales sin filtrar
      },
      (error) => {
        console.error('Error al cargar los datos CSV:', error);
      }
    );
  }

  applyFilters(): any[] {
    let filteredData = this.csvData;

    // Normaliza la comparación para regiones
    if (this.filter.region) {
      filteredData = filteredData.filter((item) =>
        item.Entity.trim().toLowerCase() === this.filter.region.trim().toLowerCase()
      );
    }

    // Usar un valor predeterminado para year si es null
    const year = this.filter.year ?? '';  // Valor por defecto si es null o undefined
    if (year) {
      filteredData = filteredData.filter((item) =>
        item.Year?.trim() === year.toString().trim()
      );
    }

    console.log('applyFilters: Datos después de aplicar filtros:', filteredData);
    return filteredData;
  }




  updateCharts(): void {
    console.log('updateCharts: Actualizando gráficos...');
    const filteredData = this.applyFilters();

    if (!filteredData || filteredData.length === 0) {
      console.warn('No se encontraron datos para los filtros seleccionados.');

      const noDataMessage = document.getElementById('noDataMessage');
      if (noDataMessage) noDataMessage.style.display = 'block';

      this.destroyCharts();
      this.createEmptyCharts();
      return;
    }

    const noDataMessage = document.getElementById('noDataMessage');
    if (noDataMessage) noDataMessage.style.display = 'none';

    this.destroyCharts();
    this.createBarChart(filteredData);
    this.createPieChart(filteredData);
    this.createLineChart(filteredData);
    this.createAreaChart(filteredData);
  }

  createEmptyCharts(): void {
    console.log('createEmptyCharts: Creando gráficos vacíos...');
    const emptyData = [0, 0, 0, 0, 0];
    const ctxBar = document.getElementById('barChart') as HTMLCanvasElement;
    if (ctxBar) {
      this.charts['barChart'] = new Chart(ctxBar.getContext('2d') as CanvasRenderingContext2D, {
        type: 'bar',
        data: {
          labels: ['Empty', 'Empty', 'Empty', 'Empty', 'Empty'],
          datasets: [
            {
              label: 'No Data',
              data: emptyData,
              backgroundColor: 'rgba(200, 200, 200, 0.5)',
              borderColor: 'rgba(200, 200, 200, 1)',
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }

  destroyCharts(): void {
    console.log('destroyCharts: Destruyendo gráficos existentes...');
    Object.keys(this.charts).forEach((key) => {
      this.charts[key]?.destroy();
      this.charts[key] = null;
      console.log(`Gráfico ${key} destruido.`);
    });
  }

  createBarChart(data: any[]): void {
    console.log('createBarChart: Creando gráfico de barras...');
    const chartData = this.calculationService.getProductionDataForBarChart(data);
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    if (ctx && chartData?.length) {
      this.charts['barChart'] = new Chart(ctx.getContext('2d') as CanvasRenderingContext2D, {
        type: 'bar',
        data: {
          labels: ['Wind', 'Solar', 'Hydro', 'Biofuel', 'Geothermal'],
          datasets: [
            {
              label: 'Energy Production (TWh)',
              data: chartData,
              backgroundColor: 'rgba(0, 123, 255, 0.5)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }

  createPieChart(data: any[]): void {
    console.log('createPieChart: Creando gráfico de pie...');
    const chartData = this.calculationService.getRenewablesShareForPieChart(data);
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (ctx && chartData?.length) {
      this.charts['pieChart'] = new Chart(ctx.getContext('2d') as CanvasRenderingContext2D, {
        type: 'pie',
        data: {
          labels: ['Wind', 'Solar', 'Hydro'],
          datasets: [
            {
              data: chartData,
              backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
            },
          ],
        },
      });
    }
  }

  createLineChart(data: any[]): void {
    console.log('createLineChart: Creando gráfico de líneas...');
    const chartData = this.calculationService.getInstalledCapacityForLineChart(data);
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    if (ctx && chartData) {
      this.charts['lineChart'] = new Chart(ctx.getContext('2d') as CanvasRenderingContext2D, {
        type: 'line',
        data: {
          labels: ['2000', '2005', '2010', '2015', '2020'],
          datasets: [
            {
              label: 'Wind Capacity (GW)',
              data: chartData.wind,
              borderColor: '#36a2eb',
              fill: false,
            },
            {
              label: 'Solar Capacity (GW)',
              data: chartData.solar,
              borderColor: '#ffcd56',
              fill: false,
            },
          ],
        },
      });
    }
  }

  createAreaChart(data: any[]): void {
    console.log('createAreaChart: Creando gráfico de área...');
    const chartData = this.calculationService.getEnergyConsumptionComparisonForAreaChart(data);
    const ctx = document.getElementById('areaChart') as HTMLCanvasElement;
    if (ctx && chartData) {
      this.charts['areaChart'] = new Chart(ctx.getContext('2d') as CanvasRenderingContext2D, {
        type: 'line',
        data: {
          labels: ['2000', '2005', '2010', '2015', '2020'],
          datasets: [
            {
              label: 'Renewable Consumption (TWh)',
              data: chartData.renewable,
              borderColor: '#36a2eb',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: true,
            },
          ],
        },
      });
    }
  }
}
