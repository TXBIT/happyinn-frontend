import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';

const jwt = new JwtHelperService();

class DecodedToken {
  userId: string;
  exp = 0;
  username = '';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private decodedToken: DecodedToken;

  constructor(private http: HttpClient) {
    this.decodedToken =
      JSON.parse(localStorage.getItem('hpi_meta')) || new DecodedToken();
  }

  private saveToken(token: string): string {
    this.decodedToken = jwt.decodeToken(token);
    localStorage.setItem('hpi_auth', token);
    localStorage.setItem('hpi_meta', JSON.stringify(this.decodedToken));
    return token;
  }

  private getExpiration() {
    return moment.unix(this.decodedToken.exp);
  }

  public register(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/register', userData);
  }

  public login(userData: any): Observable<any> {
    return this.http.post('/api/v1/users/auth', userData).pipe(
      map((data: any) => {
        return this.saveToken(data.token);
      }),
    );
  }

  public isAuthenticated(): boolean {
    return moment().isBefore(this.getExpiration());
  }

  public logout() {
    localStorage.removeItem('hpi_auth');
    localStorage.removeItem('hpi_meta');
    this.decodedToken = new DecodedToken();
  }

  public getUsername(): string {
    return this.decodedToken.username;
  }

  public getToken(): string {
    return localStorage.getItem('hpi_auth');
  }

  public getUserId(): string {
    return this.decodedToken.userId;
  }
}
