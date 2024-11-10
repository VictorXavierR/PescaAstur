import { TestBed } from '@angular/core/testing';
import { GoogleSearchService } from './google-search.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('GoogleSearchService', () => {
  let service: GoogleSearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Importar el módulo de pruebas HTTP
      providers: [GoogleSearchService]
    });

    // Inyectar el servicio y el HttpTestingController para simular las solicitudes HTTP
    service = TestBed.inject(GoogleSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Asegurarse de que no haya solicitudes HTTP pendientes al final de cada prueba
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test que verifica que el método `searchNews` realiza una solicitud HTTP GET 
   * correctamente y devuelve los resultados esperados.
   * @test
   * @name should fetch search results
   * @description Este test verifica que el método `searchNews` realiza una solicitud HTTP GET a la URL correcta
   *              y que devuelve los resultados de la búsqueda simulados correctamente.
   * @given Un término de búsqueda y el servicio `GoogleSearchService`.
   * @when Se llama al método `searchNews` con un término de búsqueda.
   * @then Se realiza una solicitud HTTP GET a la URL correcta y se reciben los resultados esperados.
   * @example 
   * service.searchNews('test').subscribe((results) => {
   *   expect(results).toEqual(mockResults);
   * });
   */
  it('should fetch search results', () => {
    const mockResults = {
      items: [
        { title: 'News 1', link: 'https://example.com/1' },
        { title: 'News 2', link: 'https://example.com/2' },
      ]
    };

    const query = 'test';
    const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=AIzaSyACoQoJZGuT3a9nLaAp2uenZ_2Jdk33sUA&cx=36ef51fead70d4dc2&num=5&sort=date`;

    // Llamar al método searchNews
    service.searchNews(query).subscribe((results) => {
      // Verificar que los resultados sean los esperados
      expect(results).toEqual(mockResults);
      // Verificar que la solicitud HTTP se haya realizado con la URL correcta
      expect(results).toEqual(mockResults); // Verificamos que la respuesta sea la correcta
    });

    // Simular la respuesta de la API
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults); // Enviar la respuesta simulada
  });
});
