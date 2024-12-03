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
import { FormsModule } from '@angular/forms';

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
    FormsModule,
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
  selectedFilters: { [key: string]: string | null } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dataService: DataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dataService.getRenewableShareData().subscribe({
      next: (data) => {
        this.loading = false;

        if (data.length > 0) {
          this.displayedColumns = Object.keys(data[0]);
          this.initializeFilters(data);

          this.dataSource.data = data;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        } else {
          console.warn('No se encontró información en el archivo CSV.');
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
    this.cdr.detectChanges();
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  private initializeFilters(data: any[]): void {
    this.displayedColumns.forEach((column) => {
      this.columnFilters[column] = Array.from(new Set(data.map((row) => row[column])))
        .filter((value) => value !== null && value !== undefined);

      this.selectedFilters[column] = null;
    });
  }

  applyFilter(column: string, value: string): void {
    this.appliedFilters[column] = value;
    this.filterData();
  }

  clearFilters(): void {
    this.appliedFilters = {};
    this.selectedFilters = {};
    this.displayedColumns.forEach((column) => {
      this.selectedFilters[column] = null;
    });

    this.dataSource.data = this.dataService.getOriginalData();
    this.dataSource.paginator?.firstPage();
  }

  private filterData(): void {
    const filteredData = this.dataSource.data.filter((row) => {
      return Object.keys(this.appliedFilters).every((column) => {
        const filterValue = this.appliedFilters[column];
        return filterValue ? row[column] === filterValue : true;
      });
    });

    this.dataSource.data = filteredData;
    this.dataSource.paginator?.firstPage();
  }
}
