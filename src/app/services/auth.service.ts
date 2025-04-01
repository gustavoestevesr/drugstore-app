import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user.model';
import { delay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Variables
  private readonly API_URL = 'http://localhost:3000/users';
  private readonly isLogged = signal(false);

  // Services
  private http = inject(HttpClient);

  constructor() {
    this.isLogged = signal<boolean>(this.getIsLoggedLocalStorage());
  }

  // Methods
  login(user: IUser) {
    return this.http.get<IUser[]>(this.API_URL).pipe(
      delay(1000),
      map((users: IUser[]) => {
        const foundUser = users.find((u) => u.email === user.email && u.password === user.password);
        if (foundUser) this.setIsLoggedLocalStorage(true);
        return foundUser || null;
      })
    );
  }

  register(user: IUser) {
    return this.http.post(this.API_URL, user).pipe(delay(1000));
  }

  // Getters
  getIsLogged() {
    return this.isLogged();
  }

  // LocalStorage
  setIsLoggedLocalStorage(value: boolean) {
    localStorage.setItem('isLogged', JSON.stringify(value));
    this.isLogged.set(value);
  }

  getIsLoggedLocalStorage(): boolean {
    const stored = localStorage.getItem('isLogged');
    return stored ? JSON.parse(stored) : false;
  }
}
