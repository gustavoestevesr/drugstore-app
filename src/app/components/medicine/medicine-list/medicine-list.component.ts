import { SelectionModel } from '@angular/cdk/collections';
import { CurrencyPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../models/product.model';
import { DrugstoreApiService } from '../../../services/drugstore-api.service';
@Component({
  selector: 'app-medicine-list',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    CurrencyPipe,
    MatProgressSpinnerModule,
    NgIf,
  ],
  templateUrl: './medicine-list.component.html',
  styleUrl: './medicine-list.component.scss',
})
export class MedicineListComponent implements OnInit, AfterViewInit {
  drugstoreApiService = inject(DrugstoreApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  @Input() searchBarValue: string = '';
  @Input() products: IProduct[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  displayedColumns: string[] = ['select', 'name', 'description', 'price', 'stock', 'actions'];
  dataSource: MatTableDataSource<IProduct> = new MatTableDataSource<IProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.activeRoute();
    this.getTotalProducts();
  }

  activeRoute() {
    this.route.queryParams.subscribe((params) => {
      this.loadProducts(params['start'], params['limit'], params['sortField']);
    });
  }

  getTotalProducts() {
    this.drugstoreApiService.getTotalProducts().subscribe((totalProducts) => {
      this.resultsLength = totalProducts;
    });
  }

  loadProducts(
    start: number = 0,
    limit: number = 10,
    sortField: string = ''
  ): void {
    this.isLoadingResults = true;
    this.drugstoreApiService.getProducts(start, limit, sortField).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource<IProduct>(res.body || []);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
      complete: () => {
        this.isLoadingResults = false;
      },
    });
  }

  getSearchBarValue(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const valueNormalized = value.trim().toLowerCase();
    this.searchBarValue = valueNormalized;
  }

  applyFilter() {
    this.dataSource.filter = this.searchBarValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  paginatorChanges(event: PageEvent) {
    this.loadProducts(event.pageIndex * event.pageSize, event.pageSize);
  }

  // Checkbox
  selection = new SelectionModel<IProduct>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  // Actions
  viewProduct(product: IProduct) {
    this.router.navigate(['/medicine', product.id, 'view']);
  }

  editProduct(product: IProduct) {
    this.router.navigate(['/medicine', product.id, 'edit']);
  }

  sellProduct() {
    this.router.navigate(['/medicine', 'sell']);
  }

  addProduct() {
    this.router.navigate(['/medicine', 'new']);
  }

}
