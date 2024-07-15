import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarineService {

  constructor(private http: HttpClient) { }

  getMarineWeather(lat: string, lon: string) {
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&daily=wave_height_max,wave_direction_dominant,wave_period_max`;
    return this.http.get(url);
  }
}
