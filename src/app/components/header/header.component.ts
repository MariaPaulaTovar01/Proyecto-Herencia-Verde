import { Component, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import this to access ngClass

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule, CommonModule], // Add CommonModule here
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuOpen = false;
  title = 'Energía Renovable';
  isScrolled = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  highlightLogo() {
    this.title = '🌞 Energía Renovable 🌿';
  }

  resetLogo() {
    this.title = 'Energía Renovable';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}
