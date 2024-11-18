export class AppComponent {
  title = 'proyecto-certificacion';
}
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SolarInfoComponent } from './components/solar-info/solar-info.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ConsumptionCalculatorComponent } from './components/consumption-calculator/consumption-calculator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'energia-solar', component: SolarInfoComponent },
  { path: 'datos-historicos', component: DataTableComponent },
  { path: 'estimador', component: ConsumptionCalculatorComponent },
  { path: 'dashboard', component: DashboardComponent },
];

export const AppRoutingModule = RouterModule.forRoot(routes);

