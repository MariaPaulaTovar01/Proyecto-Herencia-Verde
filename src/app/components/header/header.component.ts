import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; // Barra de herramientas
import { MatButtonModule } from '@angular/material/button';  // Botones
import { MatIconModule } from '@angular/material/icon';      // Iconos
import { RouterModule } from '@angular/router';             // Enlaces

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuOpen = false;
  title = 'Energía Renovable';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  highlightLogo() {
    this.title = '🌞 Energía Renovable 🌿';
  }

  resetLogo() {
    this.title = 'Energía Renovable';
  }
}
