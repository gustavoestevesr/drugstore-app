import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user.model';
import { delay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Variables
  private API_URL = 'http://localhost:3000/users';

  // Services
  private http = inject(HttpClient);

  // Methods
  login(user: IUser) {
    return this.http.get<IUser[]>(this.API_URL).pipe(
      delay(1000),
      map((users: IUser[]) => users.find((u) => u.email === user.email && u.password === user.password) || null)
    );
  }

  register(user: IUser) {
    return this.http.post(this.API_URL, user).pipe(delay(1000));
  }
}
