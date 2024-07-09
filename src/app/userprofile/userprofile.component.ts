import { Component, OnInit } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent implements OnInit{
  user !: User;
  userForm!: FormGroup;
  perfilEditable: boolean = false;
  constructor(private userService: UserService, private fb : FormBuilder) {
  }
  ngOnInit(): void {
    this.user=this.userService.getUser();
    this.userForm = this.fb.group({
      apellido: [this.user.apellido],
      DNI: [this.user.DNI],
      email: [this.user.email],
      ciudad: [this.user.ciudad],
      codigoPostal: [this.user.codigoPostal],
      direccion: [this.user.direccion],
      pais: [this.user.pais],
      provincia: [this.user.provincia],
      fechaNacimiento: [this.user.fechaNacimiento],
      telefono: [this.user.telefono],
    });
    this.userForm.disable();
  }
  onSubmit() {
    console.log(this.userForm.value);
    this.perfilEditable = false;
    // Aquí puedes enviar los datos del formulario al servidor
  }
  editable(){
    if(this.perfilEditable){
      this.userForm.disable();
      this.perfilEditable = false; 
    }else if(!this.perfilEditable){
      this.userForm.enable();
      this.perfilEditable = true;
    }
  }

}
