import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MarineService } from './marine.service';

describe('MarineService', () => {
  let service: MarineService;
  let httpMock: HttpTestingController;

  // Configurar el módulo de pruebas
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importar el módulo de pruebas HTTP
      providers: [MarineService]
    });

    // Inyectar el servicio y el controlador de pruebas HTTP
    service = TestBed.inject(MarineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Asegurarse de que no haya solicitudes HTTP pendientes después de cada test
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test que verifica que el método `getMarineWeather` realiza una solicitud HTTP GET
   * correctamente a la URL construida y devuelve los resultados esperados. 
   * @test
   * @name should fetch marine weather data
   * @description Este test verifica que el método `getMarineWeather` realiza una solicitud HTTP GET a la URL
   *              correcta y devuelve los datos del clima marino simulados correctamente.
   * @given Un par de coordenadas de latitud y longitud.
   * @when Se llama al método `getMarineWeather` con las coordenadas proporcionadas.
   * @then Se realiza una solicitud HTTP GET a la URL correcta y se reciben los datos del clima marino.
   * @example 
   * service.getMarineWeather('34.0522', '-118.2437').subscribe((data) => {
   *   expect(data).toEqual(mockWeatherData);
   * });
   */
  it('should fetch marine weather data', () => {
    const mockWeatherData = {
      daily: {
        wave_height_max: [2.5, 3.0, 3.5],
        wave_direction_dominant: [90, 180, 270],
        wave_period_max: [12, 14, 16]
      }
    };
    const lat = '34.0522';
    const lon = '-118.2437';
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height&daily=wave_height_max,wave_direction_dominant,wave_period_max`;

    // Llamar al método getMarineWeather
    service.getMarineWeather(lat, lon).subscribe((data) => {
      // Verificar que los datos recibidos son los correctos
      expect(data).toEqual(mockWeatherData);
    });
    // Simular la respuesta de la API
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockWeatherData); // Enviar la respuesta simulada
  });
});
