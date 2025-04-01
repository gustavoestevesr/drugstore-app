import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, retry, take, tap, throwError, delay } from 'rxjs';
import { IProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class DrugstoreApiService {
  private readonly API_URL = 'http://localhost:3000/products';

  private readonly httpClient = inject(HttpClient);

  getTotalProducts(): Observable<number> {
    return this.httpClient.get<number>(`${this.API_URL}`).pipe(take(1)).pipe(map((res: any) => res.length), delay(1000));
  }

  getProductByName(name: string) {
    return this.httpClient.get<number>(`${this.API_URL}`).pipe(map((res: any) => console.log(res)), delay(1000))
  }

  public getProducts(
    start: number,
    limit: number,
    sortField?: string,

  ): Observable<HttpResponse<IProduct[]>> {
    let params = new HttpParams().set('_start', start).set('_limit', limit);

    if (sortField) {
      params = params.set('_sort', sortField);
    }

    return this.httpClient
      .get<IProduct[]>(this.API_URL, { params, observe: 'response' })
      .pipe(retry(3), catchError(this.handleError), delay(1000));
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage =
      error.error instanceof ErrorEvent
        ? `Error: ${error.error.message}`
        : `Error Code: ${error.status}\nMessage: ${error.message}`;

    return throwError(() => new Error(errorMessage));
  }
}
