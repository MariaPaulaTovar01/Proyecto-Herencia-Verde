import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; // Importar módulo de la barra de herramientas
import { MatButtonModule } from '@angular/material/button';  // Importar módulo de botones
import { RouterModule } from '@angular/router';             // Importar RouterModule para los enlaces

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule], // Añadir los módulos necesarios
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // Fíjate que debe ser styleUrls (plural)
})
export class HeaderComponent {}