import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion'; // Importar MatExpansionModule
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solar-info',
  standalone: true,
  imports: [CommonModule, MatAccordion, MatButtonModule, MatExpansionModule], // Asegúrate de incluir MatExpansionModule
  templateUrl: './solar-info.component.html',
  styleUrls: ['./solar-info.component.css'],
})
export class SolarInfoComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined; // Inicialización del accordion

  expandAll(): void {
    this.accordion?.openAll(); // Verificar si 'accordion' está definido
  }

  collapseAll(): void {
    this.accordion?.closeAll(); // Verificar si 'accordion' está definido
  }
}
