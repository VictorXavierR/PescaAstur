import { Component } from '@angular/core';
import { Product } from '../model/product';
import { CartService } from '../service/cart.service';
import { User } from '../model/user';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css'
})
export class CheckOutComponent {
  subTotal: number = 0;
  user : User = new User();

  constructor(private cartService: CartService, private userService : UserService) { }

  ngOnInit(): void {
      this.subTotal = this.cartService.getTotal();
      this.user = this.userService.getUser();
  }
}
