package com.example.pescAstur.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private String username; // Nombre de usuario para el inicio de sesión
    private String password; // Contraseña del usuario
    private String email; // Correo electrónico del usuario

    // Información Personal
    private String nombre; // Nombre del usuario
    private String apellido; // Apellido del usuario
    private Date fechaNacimiento; // Fecha de nacimiento

    // Información de Contacto
    private String telefono; // Número de teléfono
    private String direccion; // Dirección física
    private String ciudad; // Ciudad
    private String provincia; // Estado o provincia
    private String codigoPostal; // Código postal
    private String pais; // País

    // Información de la Cuenta
    private Date fechaRegistro; // Fecha de registro del usuario
    private String estadoCuenta; // Estado de la cuenta (activo, inactivo, suspendido, etc.)
    //private List<Pedido> pedidos; // Lista de pedidos realizados por el usuario

    // Preferencias del Usuario
    private String idiomaPreferido; // Idioma preferido del usuario
}
