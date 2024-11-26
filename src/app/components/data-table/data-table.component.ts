import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms'; // Importar para usar ngModel

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule, // Agregar FormsModule para usar ngModel
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = []; // Columnas de la tabla
  dataSource: MatTableDataSource<any> = new MatTableDataSource(); // Fuente de datos
  loading = true; // Indicador de carga
  error = false; // Indicador de error
  columnFilters: { [key: string]: string[] } = {}; // Opciones de filtro por columna
  appliedFilters: { [key: string]: string } = {}; // Filtros aplicados
  selectedFilters: { [key: string]: string | null } = {}; // Valores seleccionados para los filtros

  @ViewChild(MatSort) sort!: MatSort; // Referencia al ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Referencia al paginador

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataService.getCsvData().subscribe({
      next: (data) => {
        this.loading = false;

        if (data.length > 0) {
          this.displayedColumns = Object.keys(data[0]); // Columnas dinámicas
          this.initializeFilters(data);

          // Asignar datos al DataSource
          this.dataSource.data = data;

          // Configurar paginador y ordenamiento
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            console.log('Paginator and Sort successfully configured.');
          });
        } else {
          console.warn('El archivo CSV está vacío.');
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        console.error('Error al cargar los datos:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    // Asegurarte de que los cambios están reflejados
    this.cdr.detectChanges();

    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('Paginator and Sort assigned successfully.');
    } else {
      console.error('Paginator or Sort is undefined.');
    }
  }

  private initializeFilters(data: any[]): void {
    // Inicializa los filtros únicos por columna
    this.displayedColumns.forEach((column) => {
      this.columnFilters[column] = Array.from(
        new Set(data.map((row) => row[column]))
      ).filter((value) => value !== null && value !== undefined);

      // Inicializa los valores seleccionados como null
      this.selectedFilters[column] = null;
    });
  }

  applyFilter(column: string, value: string): void {
    // Aplica un filtro a los datos
    this.appliedFilters[column] = value;
    this.filterData();
  }

  clearFilters(): void {
    // Limpia todos los filtros
    this.appliedFilters = {};
    this.selectedFilters = {}; // Reinicia los valores seleccionados
    this.displayedColumns.forEach((column) => {
      this.selectedFilters[column] = null;
    });

    this.dataSource.data = this.dataService.getOriginalData();
    this.dataSource.paginator?.firstPage();
  }

  private filterData(): void {
    const filteredData = this.dataService
      .getOriginalData()
      .filter((row) => {
        return Object.keys(this.appliedFilters).every((column) => {
          const filterValue = this.appliedFilters[column];
          return filterValue ? row[column] === filterValue : true;
        });
      });

    // Actualizar los datos en el DataSource
    this.dataSource.data = filteredData;
    this.dataSource.paginator?.firstPage();
  }
}
