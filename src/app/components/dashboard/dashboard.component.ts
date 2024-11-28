import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { CalculationService } from '../../services/calculation.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public charts: Record<string, Chart<any, any[], any> | null> = {};
  public filter = { region: '', year: null as number | null };
  public regions: string[] = [];
  public years: number[] = [];
  public csvData: Record<string, any[]> = {
    barChart: [],
    pieChart: [],
    lineChart: [],
    areaChart: [],
  };

  constructor(
    private dataService: DataService,
    private calculationService: CalculationService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private loadInitialData(): void {
    // Cargar datos para cada gráfico
    this.loadChartData('barChart');
    this.loadChartData('pieChart');
    this.loadChartData('lineChart');
    this.loadChartData('areaChart');
  }

  private loadChartData(chart: string): void {
    this.dataService.getCsvDataForChart(chart).subscribe((data: any[]) => {
      console.log('Datos recibidos para el gráfico', chart, data);  // Log para ver los datos
      this.csvData[chart] = data;
      if (chart === 'barChart') {
        // Asignar regiones y años para los filtros usando los datos del gráfico principal
        this.regions = this.calculationService.getUniqueRegions(data);
        this.years = this.calculationService.getUniqueYears(data);
      }
      this.updateCharts();
    });
  }

  applyFilters(): Record<string, any[]> {
    const filteredData: Record<string, any[]> = {};

    Object.keys(this.csvData).forEach((chart) => {
      filteredData[chart] = this.csvData[chart].filter((item) => {
        const matchesRegion = !this.filter.region ||
          item.Entity.trim().toLowerCase() === this.filter.region.trim().toLowerCase();
        const matchesYear = this.filter.year === null || +item.Year === +this.filter.year!;
        return matchesRegion && matchesYear;
      });
    });

    return filteredData;
  }

  updateCharts(): void {
    const filteredData = this.applyFilters();
    this.destroyCharts();

    // Crear gráficos solo si hay datos
    if (Object.values(filteredData).every((data) => !data.length)) {
      this.createEmptyCharts();
    } else {
      this.createBarChart(filteredData['barChart']);
      this.createPieChart(filteredData['pieChart']);
      this.createLineChart(filteredData['lineChart']);
      this.createAreaChart(filteredData['areaChart']);
    }
  }

  private destroyCharts(): void {
    Object.values(this.charts).forEach((chart) => chart?.destroy());
    this.charts = {};
  }

  private createEmptyCharts(): void {
    const ctxBar = document.getElementById('barChart') as HTMLCanvasElement | null;
    if (ctxBar) {
      this.charts['barChart'] = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Sin datos'],
          datasets: [
            {
              label: 'No Data',
              data: [0],
              backgroundColor: 'rgba(200, 200, 200, 0.5)',
              borderColor: 'rgba(200, 200, 200, 1)',
            },
          ],
        },
      });
    }
  }

  private createBarChart(data: any[]): void {
    const ctxBar = document.getElementById('barChart') as HTMLCanvasElement | null;
    const productionData = this.calculationService.getProductionDataForBarChart(data);
    if (ctxBar) {
      this.charts['barChart'] = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: ['Viento', 'Solar', 'Hidráulica', 'Biomasa', 'Geotérmica'],
          datasets: [
            {
              label: 'Producción (TWh)',
              data: productionData,
              backgroundColor: [
                '#FF6363', // Rojo brillante
                '#FFB400', // Amarillo brillante
                '#6B8E23', // Verde oliva
                '#3B9C9C', // Verde agua
                '#9B59B6', // Púrpura
              ],
              borderColor: [
                '#FF2A2A', '#FF9C00', '#4B7F4B', '#278F8F', '#8E2E8E'
              ],
              borderWidth: 2,
              hoverBackgroundColor: [
                '#FF4C4C', '#FFCD00', '#76A14B', '#66B8B8', '#A56BC1'
              ],
              hoverBorderColor: [
                '#D93131', '#FF9F00', '#408740', '#3F9C9C', '#7A3B7A'
              ],
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1500, // Tiempo de animación
            easing: 'easeOutBounce', // Efecto de rebote
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  family: 'Roboto',
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }
  }

  private createPieChart(data: any[]): void {
    const ctxPie = document.getElementById('pieChart') as HTMLCanvasElement | null;
    const shareData = this.calculationService.getRenewablesShareForPieChart(data);

    if (ctxPie) {
      if (shareData && shareData.length > 0) {
        this.charts['pieChart'] = new Chart(ctxPie, {
          type: 'pie',
          data: {
            labels: ['Eólica', 'Solar', 'Hidráulica'],
            datasets: [
              {
                data: shareData,
                backgroundColor: [
                  '#FF6363', // Rojo brillante
                  '#FFB400', // Amarillo brillante
                  '#6B8E23', // Verde oliva
                ],
                borderColor: '#FFFFFF',
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            animation: {
              duration: 1500,
              easing: 'easeOutExpo',
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 14,
                    family: 'Roboto',
                  },
                },
              },
            },
          },
        });
      }
    }
  }

  private createLineChart(data: any[]): void {
    const ctxLine = document.getElementById('lineChart') as HTMLCanvasElement | null;
    const capacityData = this.calculationService.getInstalledCapacityForLineChart(data);
    if (ctxLine) {
      this.charts['lineChart'] = new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: capacityData.labels,
          datasets: [
            {
              label: 'Viento',
              data: capacityData.wind,
              borderColor: '#FF6363',
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: 'Solar',
              data: capacityData.solar,
              borderColor: '#FFB400',
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: 'Geotérmica',
              data: capacityData.geothermal,
              borderColor: '#6B8E23',
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1500,
            easing: 'easeOutElastic',
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  family: 'Roboto',
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }
  }

  private createAreaChart(data: any[]): void {
    const ctxArea = document.getElementById('areaChart') as HTMLCanvasElement | null;
    const energyData = this.calculationService.getEnergyConsumptionComparisonForAreaChart(data);
    if (ctxArea) {
      this.charts['areaChart'] = new Chart(ctxArea, {
        type: 'line',
        data: {
          labels: energyData.labels,
          datasets: [
            {
              label: 'Renovable',
              data: energyData.renewable,
              backgroundColor: 'rgba(42, 126, 30, 0.2)',
              borderColor: '#2a7e1e',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: 'Convencional',
              data: energyData.conventional,
              backgroundColor: 'rgba(78, 158, 63, 0.2)',
              borderColor: '#4e9e3f',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          animation: {
            duration: 1500,
            easing: 'easeOutElastic',
          },
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 14,
                  family: 'Roboto',
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }
  }


  // Nueva función para limpiar filtros
  clearFilters(): void {
    this.filter = { region: '', year: null };
    this.updateCharts();
  }
}
