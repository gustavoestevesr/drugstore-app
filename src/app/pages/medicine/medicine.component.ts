import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProduct } from '../../models/product.model';

@Component({
  selector: 'app-medicine',
  imports: [RouterOutlet],
  templateUrl: './medicine.component.html',
  styleUrl: './medicine.component.scss',
})
export class MedicineComponent {
  // Variables
  private searchBarValue = '';
  private products: IProduct[] = [];

  // Getters and Setters
  setSearchBarValue(event: string) {
    this.searchBarValue = event;
  }

  getSearchBarValue() {
    return this.searchBarValue;
  }

  getProducts() {
    return this.products;
  }

  setProducts(products: IProduct[]) {
    this.products = products;
  }
}
