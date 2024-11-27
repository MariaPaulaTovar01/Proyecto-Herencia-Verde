import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solar-info',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatExpansionModule],
  templateUrl: './solar-info.component.html',
  styleUrls: ['./solar-info.component.css'],
})
export class SolarInfoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  ngOnInit() {
    console.log('SolarInfoComponent cargado');
  }

  expandAll(): void {
    this.accordion?.openAll();
  }

  collapseAll(): void {
    this.accordion?.closeAll();
  }
}
