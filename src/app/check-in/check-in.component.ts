import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css'
})
export class CheckInComponent implements OnInit {

  profilePicture: File | null = null;
  registerDate: string = '';
  accountState: string = '';
  bsConfig: Partial<BsDatepickerConfig>;
  defaultImageUrl: string = 'assets/images/avatar.png';
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private router : Router) {
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY', // Formato de fecha personalizado
      containerClass: 'theme-dark' // Clase de contenedor opcional para estilos personalizados
    };
    if (!this.profilePicture) {
      this.profilePicture = new File([''], 'avatar.png', { type: 'image/png' });
    }
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, , Validators.pattern(/^\d{9}$/)]],
      direccion: ['', Validators.required],
      userName: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      apellidos: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      preferLanguage: ['', Validators.required],
      dni: ['', [Validators.required, this.validarDNI()]],
      provincia: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
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
    if (!this.registerForm.valid) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Validar la contraseña
    if (this.registerForm.get('password')?.value !== this.registerForm.get('confirmPassword')?.value) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar la fecha de nacimiento
    if (this.registerForm.get('fechaNacimiento')?.value > new Date()) {
      alert('La fecha de nacimiento no puede ser mayor a la fecha actual');
      return;
    }

    const formData: FormData = new FormData();
    if (this.profilePicture) {
      formData.append('file', this.profilePicture);
    }
    formData.append('nombre', this.registerForm.get('nombre')?.value);
    formData.append('email', this.registerForm.get('email')?.value);
    formData.append('telefono', this.registerForm.get('telefono')?.value);
    formData.append('direccion', this.registerForm.get('direccion')?.value);
    formData.append('userName', this.registerForm.get('userName')?.value);
    formData.append('fechaNacimiento', this.registerForm.get('fechaNacimiento')?.value.toISOString());
    formData.append('apellido', this.registerForm.get('apellidos')?.value);
    formData.append('ciudad', this.registerForm.get('ciudad')?.value);
    formData.append('pais', this.registerForm.get('pais')?.value);
    formData.append('codigoPostal', this.registerForm.get('codigoPostal')?.value);
    formData.append('password', this.registerForm.get('password')?.value);
    formData.append('fechaRegistro', this.registerDate);
    formData.append('estadoCuenta', this.accountState);
    formData.append('idiomaPreferido', this.registerForm.get('preferLanguage')?.value);
    formData.append('DNI', this.registerForm.get('dni')?.value);
    formData.append('provincia', this.registerForm.get('provincia')?.value);

    // Enviar los datos del formulario al servidor
    fetch('http://localhost:8080/api/users/register', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.router.navigate(['/login']);
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

  /**
  * Valida el DNI del usuario.
  * @returns Devuelve true sino es válido, y null si es válido.
  */
  validarDNI(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dniRegex = /^[0-9]{8}[A-Z]$/;
      const isValid = dniRegex.test(control.value);
      return isValid ? null : { dniInvalido: true };
    };
  }
  /**
   * Comprueba si las contraseñas coinciden.
   * @param form 
   * @returns true si las contrseñas no cuinciden, y null si coinciden. 
   */
  passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };  // Devolver un error si las contraseñas no coinciden
    }
    return null;  // Devolver null si coinciden (sin error)
  }
}
