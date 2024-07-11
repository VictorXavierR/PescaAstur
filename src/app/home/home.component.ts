import { Component, OnInit } from '@angular/core';
import { GoogleSearchService } from '../service/google-search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  noticias: any[] = [];
  query: string = 'Campeonatos de pesca en Asturias';
  imagenesCargadas: boolean[] = [];// Arreglo para almacenar el estado de carga de las imágenes
  constructor(private googleSearchService: GoogleSearchService) { }

  ngOnInit(): void {
    this.searchNews();
  }

  searchNews() {
    this.googleSearchService.searchNews(this.query)
      .subscribe((data: any) => {
        // Filtrar las noticias que mencionan "boe"
        this.noticias = data.items.filter((noticia: any) => !this.contieneBoe(noticia));
        console.log(this.noticias);
      }, (error) => {
        console.error('Error al obtener noticias:', error);
      });
  }

  tieneImagen(noticia: any): boolean {
    return noticia.pagemap.metatags?.length > 0 && noticia.pagemap.metatags[0]['og:image'] ||
           noticia.pagemap.cse_image?.length > 0;
  }

  obtenerImagen(noticia: any): string {
    if (noticia.pagemap.metatags?.length > 0 && noticia.pagemap.metatags[0]['og:image']) {
      console.log('Imagen obtenida de metatags:', noticia.pagemap.metatags[0]['og:image']);
      return noticia.pagemap.metatags[0]['og:image'];
    } else if (noticia.pagemap.cse_image?.length > 0) {
      console.log('Imagen obtenida de cse_image:', noticia.pagemap.cse_image[0].src);
      return noticia.pagemap.cse_image[0].src;
    } else if (noticia.pagemap.cse_thumbnail?.length > 0) {
      console.log('Imagen obtenida de cse_thumbnail:', noticia.pagemap.cse_thumbnail[0].src);
      return noticia.pagemap.cse_thumbnail[0].src;
    } else {
      console.log('No se encontró imagen, se usará imagen por defecto.');
      return '/assets/images/imagendefecto.png';
    }
  }

  onImagenError(event: any, index: number) {
    this.imagenesCargadas[index] = false; // Marcar la imagen como no cargada
    event.target.src = '/assets/images/imagendefecto.png'; // Asignar imagen por defecto en caso de error
  }

  onImagenCargada(index: number) {
    this.imagenesCargadas[index] = true; // Marcar la imagen como cargada
  }

  // Inicializar el estado de carga de las imágenes
  inicializarEstadosImagenes() {
    this.imagenesCargadas = new Array(this.noticias.length).fill(true); // Inicializar todas las imágenes como cargadas
  }
  contieneBoe(noticia: any): boolean {
    return noticia.title.toLowerCase().includes('boe') || noticia.snippet.toLowerCase().includes('boe');
  }
}
