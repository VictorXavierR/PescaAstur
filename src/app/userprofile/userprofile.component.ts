import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders from @angular/common/http
import 'firebase/compat/firestore'; // Importar firestore


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css',
})
export class UserprofileComponent implements OnInit {
  user !: User;
  userForm!: FormGroup;
  perfilEditable: boolean = false;
  initialValues: any;
  originalProfilePhoto: string = '';
  fechaNacimientoFormateada: string = '';
  fotoPerfil: File | null = null; // Variable para almacenar la imagen de perfil seleccionada
  formData: FormData = new FormData(); // Objeto FormData para enviar datos al servidor

  constructor(private userService: UserService, private fb: FormBuilder, private http: HttpClient) {
  }
  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.originalProfilePhoto = this.user.fotoPerfil;
    this.fechaNacimientoFormateada = this.formatearFecha(this.user.fechaNacimiento);
    this.user.fechaRegistro = this.formatearFecha(this.user.fechaRegistro);
    this.userForm = this.fb.group({
      apellido: [this.user.apellido],
      DNI: [this.user.DNI],
      email: [this.user.email],
      ciudad: [this.user.ciudad],
      codigoPostal: [this.user.codigoPostal],
      direccion: [this.user.direccion],
      pais: [this.user.pais],
      provincia: [this.user.provincia],
      fechaNacimiento: [this.fechaNacimientoFormateada],
      telefono: [this.user.telefono],
      idiomaPreferido: [this.user.idiomaPreferido],
      estadoCuenta: [this.user.estadoCuenta],
      fechaRegistro: [this.user.fechaRegistro],
      userName: [this.user.nombreUsuario],
      nombre: [this.user.nombre],
    });
    this.initialValues = this.userForm.value; // Guardar los valores iniciales
    this.userForm.disable();
  }
  onSubmit() {
    this.perfilEditable = false;
    if (this.userForm.valid && this.fotoPerfil) {
      const formData = new FormData(); // Crear un nuevo FormData para cada solicitud

      // Agregar cada campo del formulario al formData
      const formDataValues = this.userForm.value;
      Object.keys(formDataValues).forEach(key => {
        formData.append(key, formDataValues[key]);
      });

      // Agregar la imagen de perfil al formData
      formData.append('fotoPerfil', this.fotoPerfil);

      // Configurar la solicitud fetch
      const url = 'http://localhost:8080/api/users/update-details';
      const options: RequestInit = {
        method: 'POST',
        body: formData,
        // No especificar Content-Type para permitir que el navegador lo maneje automáticamente
      };

      // Enviar los datos al servidor
      fetch(url, options)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al actualizar datos');
          }
          return response.text(); // Convertir la respuesta a texto
        })
        .then(data => {
          console.log('Datos actualizados exitosamente:', data);
          // Puedes realizar acciones adicionales después de la actualización
        })
        .catch(error => {
          console.error('Error al actualizar datos:', error);
          // Manejar errores de acuerdo a tus necesidades
        });
    } else {
      console.error('El formulario no es válido o no se ha seleccionado una imagen.');
    }
  }
  editable() {
    if (this.perfilEditable) {
      this.userForm.disable();
      this.perfilEditable = false;
    } else if (!this.perfilEditable) {
      this.userForm.enable();
      this.perfilEditable = true;
    }
  }
  cancelEdit() {
    this.userForm.reset(this.initialValues);
    this.user.fotoPerfil = this.originalProfilePhoto;
    this.userForm.disable();
    this.perfilEditable = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fotoPerfil = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.fotoPerfil = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  formatearFecha(fecha: any): string {
    if (!fecha || typeof fecha.seconds !== 'number') {
        console.error('El formato de fecha no es válido:', fecha);
        return '';
    }

    const seconds = fecha.seconds; // Obtener los segundos del objeto _Timestamp

    // Crear una nueva instancia de fecha usando los segundos Unix
    const date = new Date(seconds * 1000);

    // Formatear la fecha en formato yyyy-MM-dd
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son base 0
    const año = date.getFullYear();
    return `${año}-${mes}-${dia}`;
 }
}
