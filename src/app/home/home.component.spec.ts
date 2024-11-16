import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { GoogleSearchService } from '../service/google-search.service';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let googleSearchServiceMock: jasmine.SpyObj<GoogleSearchService>;

  beforeEach(async () => {
    // Create a mock service
    googleSearchServiceMock = jasmine.createSpyObj('GoogleSearchService', ['searchNews']);
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: GoogleSearchService, useValue: googleSearchServiceMock }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    // Set up default values for the mock service
    googleSearchServiceMock.searchNews.and.returnValue(of({ items: [] }));
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
 * Test que verifica que el método `searchNews` se llame correctamente al inicializar el componente.
 * Este test asegura que el método `ngOnInit` invoque el método `searchNews` cuando se inicialice el componente.
 * @test
 * @name should call searchNews on initialization
 * @description Este test valida que al llamar al método `ngOnInit`, se invoque el método `searchNews` en el componente.
 *              Esto garantiza que la lógica de inicialización del componente funcione correctamente y que la 
 *              búsqueda de noticias se active en el momento adecuado.
 * @given El componente y su método `ngOnInit` configurados.
 * @when Se llama al método `ngOnInit` del componente.
 * @then El método `searchNews` debería ser invocado durante la inicialización del componente.
 * @example 
 * spyOn(component, 'searchNews').and.callThrough(); // Espía en el método searchNews
 * component.ngOnInit(); // Llama a ngOnInit
 * expect(component.searchNews).toHaveBeenCalled(); // Verifica que searchNews haya sido llamado
 */
  it('should call searchNews on initialization', () => {
    spyOn(component, 'searchNews').and.callThrough(); // Spy on searchNews method
    component.ngOnInit(); // Call ngOnInit
    expect(component.searchNews).toHaveBeenCalled(); // Check if searchNews was called
  });

  /**
 * Test que verifica que las noticias que contienen la palabra "boe" sean filtradas correctamente.
 * Este test asegura que el componente o método correspondiente filtre adecuadamente las noticias 
 * que contienen la cadena "boe" en su título o fragmento.
 * @test
 * @name should filter out news containing "boe"
 * @description Este test valida que el método de filtrado elimine correctamente las noticias que contienen la palabra 
 *              "boe" en el título o en el fragmento. Se asegura de que las noticias no deseadas sean eliminadas de la lista 
 *              de noticias, mientras que las demás se mantengan.
 * @given Un conjunto de noticias con algunos elementos que contienen la palabra "boe" en el título o en el fragmento.
 * @when Se ejecuta el proceso de filtrado de noticias.
 * @then Las noticias que contienen la palabra "boe" deben ser filtradas y eliminadas de los resultados,
 *       mientras que las noticias restantes deben permanecer en la lista.
 * @example 
 * const mockData = {
 *   items: [
 *     { title: 'Some news', snippet: 'This is some news' },
 *     { title: 'Boe news', snippet: 'This mentions boe' },
 *     { title: 'Another news', snippet: 'This is another news' }
 *   ]
 * };
 * // Llamada al método que filtra las noticias
 * const filteredData = component.filterNews(mockData.items);
 * expect(filteredData.length).toBe(2); // Solo deben quedar dos noticias que no contienen "boe"
 */
  it('should filter out news containing "boe"', () => {
    const mockData = {
      items: [
        { title: 'Some news', snippet: 'This is some news' },
        { title: 'Boe news', snippet: 'This mentions boe' },
        { title: 'Another news', snippet: 'This is another news' }
      ]
    };
    googleSearchServiceMock.searchNews.and.returnValue(of(mockData)); // Mock service to return data
    component.searchNews(); // Call searchNews
    expect(component.noticias.length).toBe(2); // Only two items should remain after filtering
    expect(component.noticias).toEqual([
      { title: 'Some news', snippet: 'This is some news' },
      { title: 'Another news', snippet: 'This is another news' }
    ]);
  });

  /**
 * Test que verifica el manejo de errores cuando ocurre un fallo al obtener noticias.
 * Este test asegura que el componente maneje correctamente los errores al intentar obtener noticias,
 * registrando el error en la consola con un mensaje adecuado.
 * @test
 * @name should handle errors when fetching news
 * @description Este test valida que el método `searchNews` en el componente maneje de manera apropiada los errores
 *              que ocurren durante la obtención de noticias. Si ocurre un error al realizar la búsqueda,
 *              el componente debe registrar el error en la consola con el mensaje "Error al obtener noticias".
 * @given El servicio `googleSearchServiceMock` simula un error al intentar obtener noticias.
 * @when Se llama al método `searchNews` en el componente.
 * @then Si ocurre un error, el mensaje de error debe ser registrado en la consola utilizando `console.error`,
 *       con el mensaje "Error al obtener noticias" seguido del mensaje del error simulado.
 * @example 
 * const consoleErrorSpy = spyOn(console, 'error'); // Espía en console.error
 * googleSearchServiceMock.searchNews.and.returnValue(throwError('Error fetching news')); // Simula un error
 * component.searchNews(); // Llama a searchNews
 * expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener noticias:', 'Error fetching news'); // Verifica que el error se registre correctamente
 */
  it('should handle errors when fetching news', () => {
    const consoleErrorSpy = spyOn(console, 'error'); // Spy on console.error
    googleSearchServiceMock.searchNews.and.returnValue(throwError('Error fetching news')); // Simulate error
    component.searchNews(); // Call searchNews
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener noticias:', 'Error fetching news'); // Check if error is logged
  });

  /**
 * Test que verifica el comportamiento del método `tieneImagen` al verificar si una noticia contiene una imagen.
 * Este test asegura que el método `tieneImagen` identifique correctamente si una noticia contiene una imagen
 * en su metadato 'og:image' o en la propiedad 'cse_image', devolviendo la URL de la imagen si está presente, 
 * o `false` si no existe imagen.
 * @test
 * @name should return true if the news has an image
 * @description Este test valida que el método `tieneImagen` devuelva la URL de la imagen si la noticia tiene una imagen
 *              asociada en sus metadatos. En caso contrario, el método debe devolver `false` cuando no se encuentra imagen.
 * @given Una noticia con la propiedad 'og:image' que contiene una URL de imagen y otra noticia sin dicha propiedad.
 * @when Se llama al método `tieneImagen` con ambos tipos de noticias.
 * @then El método debe devolver la URL de la imagen si la propiedad 'og:image' está presente en la noticia. Si no existe 
 *       una imagen, debe devolver `false`.
 * @example 
 * const noticiaWithImage = { 
 *   pagemap: { 
 *     metatags: [{ 'og:image': 'http://example.com/image.jpg' }], 
 *     cse_image: [] 
 *   } 
 * };
 * const noticiaWithoutImage = { 
 *   pagemap: { 
 *     metatags: [], 
 *     cse_image: [] 
 *   } 
 * };
 * expect(component.tieneImagen(noticiaWithImage)).toContain("http://example.com/image.jpg");
 * expect(component.tieneImagen(noticiaWithoutImage)).toBeFalse();
 */
  it('should return true if the news has an image', () => {
    const noticiaWithImage = {
      pagemap: {
        metatags: [{ 'og:image': 'http://example.com/image.jpg' }],
        cse_image: []
      }
    };

    const noticiaWithoutImage = {
      pagemap: {
        metatags: [],
        cse_image: []
      }
    };

    // Test for a news item with an image
    expect(component.tieneImagen(noticiaWithImage)).toContain("http://example.com/image.jpg"); // Should return true
    // Test for a news item without an image
    expect(component.tieneImagen(noticiaWithoutImage)).toBeFalse(); // Should return false
  });

  /**
 * Test que verifica el comportamiento del método `obtenerImagen` para devolver la URL de la imagen asociada a una noticia.
 * Este test asegura que el método `obtenerImagen` extraiga correctamente la URL de la imagen desde los metadatos 
 * de la noticia (si está presente en 'og:image'), devolviendo la URL correcta.
 * @test
 * @name should return the correct image URL from obtenerImagen()
 * @description Este test valida que el método `obtenerImagen` en el componente devuelva la URL de la imagen si la propiedad 
 *              `'og:image'` está presente en los metadatos de la noticia. En este caso, debe devolver correctamente 
 *              la URL proporcionada en la propiedad.
 * @given Una noticia con el metadato `'og:image'` que contiene una URL de imagen válida.
 * @when Se llama al método `obtenerImagen` pasando una noticia con el metadato `'og:image'`.
 * @then El método debe devolver la URL de la imagen contenida en el metadato `'og:image'`.
 * @example 
 * const noticia = { 
 *   pagemap: { 
 *     metatags: [{ 'og:image': 'http://example.com/image.jpg' }], 
 *     cse_image: [] 
 *   } 
 * };
 * const imageUrl = component.obtenerImagen(noticia);
 * expect(imageUrl).toBe('http://example.com/image.jpg'); // Verifica que la URL de la imagen se obtiene correctamente
 */
  it('should return the correct image URL from obtenerImagen()', () => {
    const noticia = {
      pagemap: {
        metatags: [{ 'og:image': 'http://example.com/image.jpg' }],
        cse_image: []
      }
    };
    const imageUrl = component.obtenerImagen(noticia);

    expect(imageUrl).toBe('http://example.com/image.jpg'); // Should return the correct image URL
  });

  /**
 * Test que verifica el comportamiento del método `obtenerImagen` cuando no se encuentra ninguna imagen asociada a la noticia.
 * Este test asegura que, en caso de que no se encuentre una imagen en los metadatos de la noticia, el método `obtenerImagen`
 * devuelva una URL de imagen predeterminada.
 * @test
 * @name should set a default image if no images are found
 * @description Este test valida que el método `obtenerImagen` devuelva la URL de una imagen predeterminada 
 *              ('/assets/images/imagendefecto.png') cuando no se encuentran imágenes en los metadatos de la noticia.
 * @given Una noticia que no contiene metadatos relacionados con imágenes.
 * @when Se llama al método `obtenerImagen` con una noticia que no tiene imágenes en los metadatos.
 * @then El método debe devolver la URL de una imagen predeterminada: '/assets/images/imagendefecto.png'.
 * @example 
 * const noticia = { pagemap: {} }; // Noticia sin metadatos de imagen
 * const imageUrl = component.obtenerImagen(noticia);
 * expect(imageUrl).toBe('/assets/images/imagendefecto.png'); // Verifica que se devuelve la imagen predeterminada
 */
  it('should set a default image if no images are found', () => {
    const noticia = {
      pagemap: {}
    };
    const imageUrl = component.obtenerImagen(noticia);
    expect(imageUrl).toBe('/assets/images/imagendefecto.png'); // Should return default image URL
  });
});
