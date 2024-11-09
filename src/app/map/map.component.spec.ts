import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { WeatherService } from '../service/weather.service';
import { MarineService } from '../service/marine.service';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { ChartModule } from 'primeng/chart'; // Importa ChartModule
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let weatherServiceMock: jasmine.SpyObj<WeatherService>;
  let marineServiceMock: jasmine.SpyObj<MarineService>;
  let cdrMock: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    // Crear mocks de los servicios
    weatherServiceMock = jasmine.createSpyObj('WeatherService', ['getWeather']);
    marineServiceMock = jasmine.createSpyObj('MarineService', ['getMarineWeather']);
    cdrMock = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [ HttpClientTestingModule, ChartModule ],
      providers: [
        { provide: WeatherService, useValue: weatherServiceMock },
        { provide: MarineService, useValue: marineServiceMock },
        { provide: ChangeDetectorRef, useValue: cdrMock }
      ]
    });

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle map click, create a marker and fetch weather data', () => {
    const lat = 43.3619;
    const lng = -5.8494;
  
    // Datos de prueba para el clima
    const weatherResponse = {
      hourly: {
        time: ['2024-11-09T00:00:00', '2024-11-09T01:00:00'],
        temperature_2m: [10, 11],
        precipitation_probability: [10, 20],
        wind_speed_10m: [5, 4],
        wind_direction_10m: [90, 180]
      }
    };
  
    // Mock de los servicios
    weatherServiceMock.getWeather.and.returnValue(of(weatherResponse));
    marineServiceMock.getMarineWeather.and.returnValue(of({}));
  
    // Crear un espía para el marcador
    const markerMock = { addTo: jasmine.createSpy('addTo') };
    spyOn(L, 'marker').and.returnValue(markerMock as any);
  
    // Mock del método de mapa 'on' para escuchar el evento de clic
    const mapMock = {
      on: jasmine.createSpy('on').and.callFake((eventName: string, callback: Function) => {
        if (eventName === 'click') {
          // Simulamos que el evento de clic ha sido disparado con las coordenadas lat, lng
          callback({ latlng: { lat, lng } });
        }
      }),
      setView: jasmine.createSpy('setView'),
      invalidateSize: jasmine.createSpy('invalidateSize')
    };
  
    // Asignamos el mapa mock al componente
    component['map'] = mapMock as any;
  
    // Llamar a la función ngOnInit para inicializar el mapa
    component.ngOnInit();
  
    // Verificar que la función de clic se haya ejecutado y que se haya llamado a getWeather con las coordenadas correctas
    expect(weatherServiceMock.getWeather).toHaveBeenCalledWith(lat.toString(), lng.toString());
    
    // Verificar si el marcador fue creado y agregado con las coordenadas correctas
    expect(L.marker).toHaveBeenCalledWith([lat, lng], jasmine.any(Object));
    expect(markerMock.addTo).toHaveBeenCalledWith(component['map']);
  });
  

  it('should update weather data and chart data after fetching weather', () => {
    const weatherResponse = {
      hourly: {
        time: ['2024-11-09T00:00:00', '2024-11-09T01:00:00'],
        temperature_2m: [10, 11],
        precipitation_probability: [10, 20],
        wind_speed_10m: [5, 4],
        wind_direction_10m: [90, 180]
      }
    };

    weatherServiceMock.getWeather.and.returnValue(of(weatherResponse));

    // Llamar a getWeather
    component.getWeather(43.3619, -5.8494);

    // Esperar que los datos de las gráficas se actualicen
    expect(component.lineChartData.labels.length).toBeGreaterThan(0);
    expect(component.lineChartData.datasets.length).toBeGreaterThan(0);

    // Verifica que los datos se han asignado correctamente
    expect(component.lineChartData.labels).toEqual(weatherResponse.hourly.time);
  });

  it('should handle error in weather service and log error', () => {
    // Configura el mock del servicio de clima para que falle
    const errorResponse = new Error('Error fetching weather data');
    weatherServiceMock.getWeather.and.returnValue(throwError(errorResponse));
  
    // Espía de la función console.error para verificar que se haya llamado
    spyOn(console, 'error');
  
    // Simula un clic en el mapa
    const lat = 43.3619;
    const lng = -5.8494;
    
    // Ejecuta la función que invoca el servicio y maneja el error
    component.getWeather(lat, lng);
  
    // Verifica que console.error haya sido llamado con el mensaje correcto
    expect(console.error).toHaveBeenCalledWith('Error fetching weather data:', errorResponse);
  });  
});
