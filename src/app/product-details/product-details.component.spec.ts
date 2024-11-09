import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductDetailsComponent } from './product-details.component';
import { ProductService } from '../service/product.service';
import { of } from 'rxjs';
import { Product } from '../model/product';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    // Crear un mock del servicio ProductService
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct', 'addCommentToProduct', 'addRatingToProduct']);

    // Configurar el TestBed
    await TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [
        FormsModule // Asegura que FormsModule está incluido
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    productServiceMock = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;

    // Datos de prueba para el producto
    const mockProduct: Product = {
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0,
    };

    // Hacer que el mock del servicio devuelva un producto de prueba
    productServiceMock.getProduct.and.returnValue(mockProduct);
    // Mock para `addCommentToProduct` y `addRatingToProduct`
    productServiceMock.addCommentToProduct.and.returnValue(of({}));
    productServiceMock.addRatingToProduct.and.returnValue(of({}));

    fixture.detectChanges();
  });

  afterEach(() => {
    // Restablecer los espías después de cada prueba para evitar conflictos
    productServiceMock.addCommentToProduct.calls.reset();
    productServiceMock.addRatingToProduct.calls.reset();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on ngOnInit', () => {
    expect(component.product).toEqual({
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0
    });
    expect(productServiceMock.getProduct).toHaveBeenCalled();
  });

  it('should format price correctly', () => {
    const formattedPrice = component.formatPrice(100);
    expect(formattedPrice).toMatch(/100,00\s?€/);
  });

  it('should calculate average rating correctly', () => {
    const ratings = [5, 3, 4];
    const average = component.getAverageRating(ratings);
    expect(average).toBe(4);
  });

  it('should call addToCart when a product is added to cart', () => {
    spyOn(console, 'log'); // Espiar console.log
    const mockProduct: Product = {
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0
    };

    component.addToCart(mockProduct);

    expect(console.log).toHaveBeenCalledWith(mockProduct);
  });

  it('should not add comment or rating if newComment is empty or rating is 0', () => {
    const mockProduct: Product = {
      cantidadStock: 5,
      categoria: 'prueba',
      coste: 10,
      descripcion: 'A great product',
      descuento: 0,
      dimensiones: '',
      fechaCreacion: '',
      imagenURL: '',
      marca: '',
      modelo: '',
      nombre: '',
      peso: '',
      precio: 20,
      rating: [],
      comentarios: [],
      UID: '1',
      cantidad: 0
    };
    component.newComment = '';
    component.rating = 0;

    // Llama a addComment en condiciones en las que no debe añadir comentario ni calificación
    component.addComment(mockProduct);

    // Verificamos que no se haya añadido comentario o rating al producto
    expect(mockProduct.comentarios.length).toBe(0);
    expect(mockProduct.rating.length).toBe(0);

    // Verificamos que no se hayan llamado los métodos de servicio
    expect(productServiceMock.addCommentToProduct).not.toHaveBeenCalled();
    expect(productServiceMock.addRatingToProduct).not.toHaveBeenCalled();
  });
});
