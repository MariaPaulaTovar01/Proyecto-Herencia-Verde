import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatToolbarModule, MatButtonModule,CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  loading = true;
  error = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    console.log('Inicializando DataTableComponent...');
    this.dataService.getCsvData().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.loading = false;

        if (data.length > 0) {
          this.displayedColumns = Object.keys(data[0]);
          console.log('Columnas generadas dinámicamente:', this.displayedColumns);
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
}
