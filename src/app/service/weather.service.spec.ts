import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;  // Usamos esta clase para interceptar las peticiones HTTP.
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Importamos el módulo de pruebas de HttpClient.
      providers: [WeatherService]  // Proveemos el servicio WeatherService.
    });
    
    service = TestBed.inject(WeatherService);  // Obtenemos la instancia del servicio.
    httpMock = TestBed.inject(HttpTestingController);  // Obtenemos el controlador HTTP para interceptar las peticiones.
  });

  afterEach(() => {
    httpMock.verify();  // Verificamos que no haya solicitudes HTTP pendientes después de cada test.
  });

  /**
   * Test para verificar que el servicio WeatherService se haya creado correctamente.
   * Este test asegura que el servicio esté disponible para ser utilizado.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();  // Verificamos que el servicio se cree correctamente.
  });

  /**
   * Test para verificar que el método getWeather realiza correctamente una solicitud HTTP 
   * y devuelve los datos del clima esperados para unas coordenadas dadas.
   * @description Este test simula una solicitud HTTP al endpoint de clima de la API Open Meteo,
   * y verifica que la respuesta recibida coincida con los datos simulados (mocked data).
   * @given Unas coordenadas geográficas válidas (latitud y longitud).
   * @when Se llama al método getWeather del servicio.
   * @then Se debe recibir una respuesta con los datos del clima, y la solicitud debe ser de tipo GET.
   */
  it('should fetch weather data for given coordinates', () => {
    const lat = '40.7128';  // Latitud de ejemplo (Nueva York)
    const lon = '-74.0060'; // Longitud de ejemplo (Nueva York)
    const mockWeatherData = {
      latitude: 40.7128,
      longitude: -74.0060,
      hourly: {
        temperature_2m: [22.5, 23.0, 24.0],
        relative_humidity_2m: [60, 62, 65],
        precipitation_probability: [0, 20, 30],
        rain: [0, 1, 0],
        snowfall: [0, 0, 0],
        wind_speed_10m: [5, 6, 4],
        wind_speed_80m: [7, 8, 5],
        wind_speed_120m: [8, 9, 6],
        wind_speed_180m: [10, 11, 7],
        wind_direction_10m: [90, 100, 110],
        wind_direction_80m: [120, 130, 140],
        wind_direction_120m: [150, 160, 170],
        wind_direction_180m: [180, 190, 200],
      }
    };

    service.getWeather(lat, lon).subscribe((data) => {
      // Verificamos que la respuesta sea la esperada
      expect(data).toEqual(mockWeatherData);
    });

    // Simulamos la respuesta de la API
    const req = httpMock.expectOne(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,snowfall,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m`);
    expect(req.request.method).toBe('GET');  // Verificamos que la solicitud fue un GET.
    
    req.flush(mockWeatherData);  // Respondemos con los datos simulados.
  });

  /**
   * Test para manejar las respuestas con error del servidor.
   * Este test asegura que cuando la API devuelva un error (por ejemplo, un error 500),
   * el servicio pueda manejarlo correctamente.
   * @description Simula una respuesta con error 500 de la API y verifica que el servicio maneje correctamente el error.
   * @given Unas coordenadas geográficas válidas (latitud y longitud).
   * @when Se llama al método getWeather del servicio y la API devuelve un error.
   * @then El servicio debe manejar el error y emitir el código de estado 500.
   */
  it('should handle an error response', () => {
    const lat = '40.7128';
    const lon = '-74.0060';
    
    service.getWeather(lat, lon).subscribe(
      () => fail('should have failed with 500 error'),
      (error) => {
        // Verificamos que el error sea el esperado
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,rain,snowfall,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m`);
    expect(req.request.method).toBe('GET');
    
    // Simulamos un error en la solicitud
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
