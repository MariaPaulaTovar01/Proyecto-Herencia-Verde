import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  
  // Método para devolver datos simulados
  getMockData() {
    return [
      { year: 2020, source: 'Solar', production: 120 },
      { year: 2021, source: 'Wind', production: 150 },
      { year: 2022, source: 'Hydro', production: 200 }
    ];
  }
}
