import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css'
})
export class CheckInComponent implements OnInit{

  name: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  profilePicture: File | null = null;
  userName: string = '';
  birthDate: Date | null = null;
  lastName: string = '';
  city: string = '';
  country: string = '';
  postalCode: string = '';
  password: string = '';
  confirmPassword: string = '';
  registerDate: string = '';
  accountState: string = '';
  preferLanguage: string = '';
  bsConfig: Partial<BsDatepickerConfig>;
  dni: string = '';
  provincia: string = '';
  defaultImageUrl: string = 'assets/images/avatar.png';

  constructor() {
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY', // Formato de fecha personalizado
      containerClass: 'theme-dark-blue' // Clase de contenedor opcional para estilos personalizados
    };
    if (!this.profilePicture) {
      this.profilePicture = new File([''], 'avatar.png', { type: 'image/png' });
    }
  }
  ngOnInit(): void {
    this.loadDefaultImage();
  }
  /**
   * 
   * @param event {Event} Evento de cambio de archivo
   * @returns {void}
   * @memberof CheckInComponent
   * @description Se ejecuta cuando se selecciona un archivo en el input de tipo file.
   * Lee el contenido del archivo seleccionado y lo muestra en un elemento HTMLImageElement.
   * Si no se selecciona ningún archivo, no hace nada.
   * Si ocurre un error al leer el archivo, se muestra un mensaje en la consola.
   * Si no hay errores, muestra la imagen previsualizada en el elemento HTMLImageElement.
   */
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      // Guardar el archivo seleccionado en una propiedad
      this.profilePicture = file;

      // Crear un FileReader para leer el contenido del archivo
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreview = document.getElementById('imagePreview') as HTMLImageElement;
        if (imagePreview) {
          // Mostrar la imagen previsualizada
          imagePreview.src = reader.result as string;
        }
      };

      // Leer el contenido del archivo como URL base64
      reader.readAsDataURL(file);
    }
  }
  /**
   * @returns {void}
   * @memberof CheckInComponent
   * @description Registra un nuevo usuario en el sistema.
   * Si algún campo del formulario no está completo, se muestra un mensaje de alerta.
   * Si las contraseñas no coinciden, se muestra un mensaje de alerta.
   * Si la fecha de nacimiento es mayor a la fecha actual, se muestra un mensaje de alerta.
   * Si no hay errores, se envían los datos del formulario al servidor.
   * Si ocurre un error al enviar los datos, se muestra un mensaje en la consola.
   */
  register() {
    this.registerDate = new Date().toISOString().split('T')[0]; // Formato yyyy-MM-dd
    this.accountState = 'active';

    
    // Validar los datos del formulario
    if (!this.name || !this.email || !this.phone || !this.address || !this.userName || !this.birthDate || !this.lastName || !this.city || !this.country || !this.postalCode || !this.password || !this.confirmPassword || !this.preferLanguage || !this.dni) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Validar la contraseña
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar la fecha de nacimiento
    if (this.birthDate > new Date()) {
      alert('La fecha de nacimiento no puede ser mayor a la fecha actual');
      return;
    }

    const formData: FormData = new FormData();
    if (this.profilePicture) {
      formData.append('file', this.profilePicture);
    }
    formData.append('nombre', this.name);
    formData.append('email', this.email);
    formData.append('telefono', this.phone);
    formData.append('direccion', this.address);
    formData.append('userName', this.userName);
    formData.append('fechaNacimiento', this.birthDate.toISOString());
    formData.append('apellido', this.lastName);
    formData.append('ciudad', this.city);
    formData.append('pais', this.country);
    formData.append('codigoPostal', this.postalCode);
    formData.append('password', this.password);
    formData.append('fechaRegistro', this.registerDate);
    formData.append('estadoCuenta', this.accountState);
    formData.append('idiomaPreferido', this.preferLanguage);
    formData.append('DNI', this.dni);
    formData.append('provincia', this.provincia);

    // Enviar los datos del formulario al servidor
    fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }
  /**
   * @returns {Promise<void>}
   * @memberof CheckInComponent
   * @description Carga la imagen predeterminada del servidor y la asigna a la propiedad profilePicture.
   * Si ocurre un error, se muestra un mensaje en la consola.
   * Si no hay errores, se muestra la imagen previsualizada en el elemento HTMLImageElement.
   * Si no se puede cargar la imagen predeterminada, se muestra un mensaje en la consola.
   */
  async loadDefaultImage(): Promise<void> {
    try {
      const response = await fetch(this.defaultImageUrl);// Cargar la imagen predeterminada
      const blob = await response.blob();// Convertir la imagen a un objeto Blob
      this.profilePicture = new File([blob], 'avatar.png', { type: blob.type });// Crear un archivo a partir del objeto Blob
    } catch (error) {
      console.error('Error loading default image:', error);
    }
  }

}
