package com.example.pescAstur.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Product {
    private int cantidadStock;
    private String categoria;
    private double coste;
    private String descripcion;
    private double descuento;
    private String dimensiones;
    private String fechaCreacion;
    private String imagenURL;
    private String marca;
    private String nombre;
    private int numeroDeReseñas;
    private String peso;
    private double precio;
    private int rating;
    private String UID;
}
