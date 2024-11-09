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

  it('should call searchNews on initialization', () => {
    spyOn(component, 'searchNews').and.callThrough(); // Spy on searchNews method
    component.ngOnInit(); // Call ngOnInit
    expect(component.searchNews).toHaveBeenCalled(); // Check if searchNews was called
  });

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

  it('should handle errors when fetching news', () => {
    const consoleErrorSpy = spyOn(console, 'error'); // Spy on console.error
    googleSearchServiceMock.searchNews.and.returnValue(throwError('Error fetching news')); // Simulate error
    component.searchNews(); // Call searchNews
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener noticias:', 'Error fetching news'); // Check if error is logged
  });

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

  it('should set a default image if no images are found', () => {
    const noticia = {
      pagemap: {}
    };
    const imageUrl = component.obtenerImagen(noticia);
    expect(imageUrl).toBe('/assets/images/imagendefecto.png'); // Should return default image URL
  });
});
