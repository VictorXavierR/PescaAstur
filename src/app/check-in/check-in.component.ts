import { Component } from '@angular/core';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css'
})
export class CheckInComponent {
name: string = '';
email: string = '';
phone: string = '';
address: string = '';
profilePicture: File | null = null;
userName: string = '';
birthDate: string = '';
lastName: string = '';
city: string = '';
country: string = '';
postalCode: string = '';
password: string = '';
confirmPassword: string = '';
registerDate: string = '';
accountState: string = '';
preferLanguage: string = '';

constructor() { }

onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}

}
