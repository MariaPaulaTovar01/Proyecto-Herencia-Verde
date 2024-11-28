import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-consumption-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Importar CommonModule y FormsModule
  templateUrl: './consumption-calculator.component.html',
  styleUrls: ['./consumption-calculator.component.css']
})
export class ConsumptionCalculatorComponent implements OnInit {
  monthlyConsumption: number = 0;
  percentage: number | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  solarProduction2021: number | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    console.log('Iniciando el componente, cargando datos de producción solar...');
    this.loadSolarProductionData();
  }

  loadSolarProductionData(): void {
    console.log('Solicitando los datos de energía renovable...');
    this.dataService.getRenewableShareData().subscribe(
      (data) => {
        console.log('Datos obtenidos de la API:', data);

        // Filtrar los datos por país (Colombia) y año (2021)
        const filteredData = data.filter(
          (item: any) =>
            item.Entity === 'Colombia' && item.Year === '2021'
        );

        console.log('Datos filtrados para Colombia 2021:', filteredData);

        if (filteredData.length > 0) {
          this.solarProduction2021 = parseFloat(
            filteredData[0]['Electricity from solar (TWh)']
          );
          console.log('Producción solar para 2021:', this.solarProduction2021);
        } else {
          this.errorMessage = 'No se encontraron datos de energía solar para Colombia en 2021.';
          console.error(this.errorMessage);
        }
      },
      (error) => {
        this.errorMessage = 'Error al cargar los datos de energía renovable.';
        console.error('Error al obtener los datos:', error);
      }
    );
  }

  onConsumptionChange(): void {
    console.log('Consumo mensual cambiado. Valor actual:', this.monthlyConsumption);
  }

  calculatePercentage(): void {
    console.log('Calculando el porcentaje...');
    this.successMessage = null; // Reset success message
    this.errorMessage = null;   // Reset error message

    if (this.monthlyConsumption <= 0) {
      this.errorMessage = 'Por favor, ingresa un consumo mensual válido mayor a cero.';
      return;
    }

    if (this.solarProduction2021 !== null) {
      const valorUsuariosTwhAño = (this.monthlyConsumption / 1000) * 12;
      console.log('Valor del consumo anual en TWh:', valorUsuariosTwhAño);

      if (this.solarProduction2021 > 0) {
        this.percentage = (valorUsuariosTwhAño / this.solarProduction2021) * 100;
        console.log('Porcentaje calculado de la producción solar:', this.percentage);

        // Validación: el porcentaje no puede ser mayor a 100
        if (this.percentage > 100) {
          this.percentage = 100;
          this.successMessage = 'Tu consumo anual supera la producción solar de Colombia. El porcentaje se ajustó a 100%.';
        }
        this.errorMessage = null; // Reseteamos el mensaje de error si todo va bien
      } else {
        this.percentage = null;
        this.errorMessage = 'La producción de energía solar no está disponible o es cero.';
        console.error(this.errorMessage);
      }
    } else {
      this.percentage = null;
      this.errorMessage = 'Por favor, espera a que los datos de producción solar estén disponibles.';
      console.error(this.errorMessage);
    }
  }
}
