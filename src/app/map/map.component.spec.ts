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

  /**
 * Test que verifica que al hacer clic en el mapa, se cree un marcador en la ubicación clickeada
 * y se obtengan los datos del clima para esa ubicación.
 * El test simula un clic en el mapa, creando un marcador en las coordenadas especificadas 
 * y asegurando que el servicio de clima (`weatherService`) se haya llamado con las coordenadas correctas.
 * También verifica que el marcador sea agregado al mapa.
 * Pasos realizados por este test:
 * 1. Se definen las coordenadas (latitud y longitud) de la ubicación en el mapa.
 * 2. Se configura una respuesta simulada para el servicio de clima (`weatherServiceMock`) 
 *    que contiene datos meteorológicos para esas coordenadas.
 * 3. Se simula la creación de un marcador con el uso de `L.marker` (con un espía).
 * 4. Se crea un mapa simulado que responde al evento de clic y pasa las coordenadas del clic.
 * 5. Se llama a la función `ngOnInit()` para inicializar el mapa y configurar el evento de clic.
 * 6. Se verifica que el servicio de clima se haya llamado con las coordenadas correctas.
 * 7. Se valida que el marcador se haya creado y agregado al mapa con las coordenadas correctas.
 * @see component.ngOnInit()
 * @see weatherServiceMock.getWeather()
 * @see L.marker()
 * @see mapMock.on()
 * Expectativas:
 * - Se espera que `weatherServiceMock.getWeather` sea llamado con las coordenadas lat y lng.
 * - Se espera que `L.marker` sea llamado con las coordenadas lat y lng.
 * - Se espera que `addTo` del marcador simulado haya sido llamado con el mapa.
 */
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
  
  /**
 * Test que verifica que los datos del clima y los datos de la gráfica se actualizan correctamente
 * después de obtener los datos meteorológicos desde el servicio de clima.
 * Este test asegura que después de que el componente obtiene los datos meteorológicos de la ubicación
 * especificada, las etiquetas de la gráfica y los conjuntos de datos de la gráfica se actualizan con la 
 * información obtenida, como la hora, la temperatura, la probabilidad de precipitación y otras métricas.
 * @test
 * @name should update weather data and chart data after fetching weather
 * @description Este test asegura que después de hacer una llamada al servicio de clima, los datos meteorológicos
 *              obtenidos son correctamente asignados a la gráfica y las etiquetas de la gráfica se actualizan con
 *              los valores esperados, como el tiempo (hora) proporcionado en la respuesta.
 * @given El componente está configurado para llamar al servicio `getWeather` con las coordenadas de latitud y longitud.
 * @when Se llama al método `getWeather()` con una latitud y longitud especificadas y se obtiene una respuesta del servicio.
 * @then Los datos de la gráfica (`lineChartData.labels` y `lineChartData.datasets`) deben ser actualizados con los valores
 *       de la respuesta, y las etiquetas de la gráfica deben coincidir con los datos de tiempo proporcionados.
 * @example 
 * weatherServiceMock.getWeather.and.returnValue(of({
 *   hourly: {
 *     time: ['2024-11-09T00:00:00', '2024-11-09T01:00:00'],
 *     temperature_2m: [10, 11],
 *     precipitation_probability: [10, 20],
 *     wind_speed_10m: [5, 4],
 *     wind_direction_10m: [90, 180]
 *   }
 * }));
 * component.getWeather(43.3619, -5.8494);
 * expect(component.lineChartData.labels).toEqual(['2024-11-09T00:00:00', '2024-11-09T01:00:00']);
 * expect(component.lineChartData.datasets.length).toBeGreaterThan(0);
 */
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

  /**
 * Test que verifica el manejo de errores cuando se falla al obtener los datos del clima
 * desde el servicio de clima.
 * Este test asegura que si el servicio de clima falla al obtener los datos, el componente
 * maneja el error correctamente y registra el error en la consola mediante `console.error`.
 * @test
 * @name should handle error in weather service and log error
 * @description Este test simula una falla al obtener los datos del clima a través del servicio,
 *              verifica que el componente maneje el error y registre el mensaje de error adecuado
 *              en la consola.
 * @given El servicio de clima retorna un error al intentar obtener los datos meteorológicos.
 * @when Se llama al método `getWeather` con las coordenadas del mapa y el servicio de clima falla.
 * @then El error debe ser registrado en la consola mediante `console.error` con el mensaje
 *       adecuado.
 * @example 
 * // Simula el fallo en el servicio
 * weatherServiceMock.getWeather.and.returnValue(throwError(new Error('Error fetching weather data')));
 * spyOn(console, 'error');
 * component.getWeather(43.3619, -5.8494);
 * expect(console.error).toHaveBeenCalledWith('Error fetching weather data:', errorResponse);
 */
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
