import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loading = true;
  error = false;
  columnFilters: { [key: string]: string[] } = {};
  appliedFilters: { [key: string]: string } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getCsvData().subscribe({
      next: (data) => {
        this.loading = false;

        if (data.length > 0) {
          this.displayedColumns = Object.keys(data[0]);
          this.initializeFilters(data);

          // Asignar los datos al MatTableDataSource
          this.dataSource = new MatTableDataSource(data);

          // Conectar el paginador y el ordenamiento
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          console.warn('El archivo CSV no contiene datos o está vacío.');
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
    // Asegurarse de que el paginador y el ordenamiento estén correctamente configurados
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private initializeFilters(data: any[]): void {
    this.displayedColumns.forEach((column) => {
      this.columnFilters[column] = Array.from(new Set(data.map((row) => row[column]))).filter(
        (value) => value !== null && value !== undefined
      );
    });
  }

  applyFilter(column: string, value: string): void {
    this.appliedFilters[column] = value;
    this.filterData();
  }

  clearFilters(): void {
    this.appliedFilters = {}; // Reseteamos los filtros
    this.dataSource.data = this.dataService.getOriginalData(); // Recuperamos los datos originales
    this.dataSource.paginator?.firstPage(); // Reiniciar la paginación
  }

  private filterData(): void {
    const filteredData = this.dataService.getOriginalData().filter((row) => {
      return Object.keys(this.appliedFilters).every((column) => {
        const filterValue = this.appliedFilters[column];
        return filterValue ? row[column] === filterValue : true;
      });
    });

    // Actualizamos los datos filtrados y los conectamos nuevamente al paginador
    this.dataSource.data = filteredData;

    // Si es necesario, reseteamos la paginación
    this.dataSource.paginator?.firstPage();
  }
}
