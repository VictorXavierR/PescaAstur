export class Product {
    cantidadStock:number;
    categoria:string;
    coste:number;
    descripcion:string;
    descuento:number;
    dimensiones:string;
    fechaCreacion:string;
    imagenURL:string;
    marca:string;
    modelo:string;
    nombre:string;
    peso:string;
    precio:number;
    rating:number[];
    comentarios: string[];

    constructor(){
        this.cantidadStock = 0;
        this.categoria = '';
        this.coste = 0;
        this.descripcion = '';
        this.descuento = 0;
        this.dimensiones = '';
        this.fechaCreacion = '';
        this.imagenURL = '';
        this.marca = '';
        this.modelo = '';
        this.nombre = '';
        this.peso = '';
        this.precio = 0;
        this.rating =[];
        this.comentarios = [];
    }
}
