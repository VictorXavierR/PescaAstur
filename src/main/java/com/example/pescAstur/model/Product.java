package com.example.pescAstur.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private String peso;
    private double precio;
    private List<Integer> rating;
    private List<String>comentarios;
    private String UID;
}
