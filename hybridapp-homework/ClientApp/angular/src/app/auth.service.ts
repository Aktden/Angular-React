import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

export interface AuthResponse {
  username: string
}

export interface DemoResponse {
  message: string
  serverTimeUtc: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly apiBase = '/api'

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBase}/auth/login`, {
      username,
      password,
      rememberMe: true,
    }, { withCredentials: true })
  }

  me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiBase}/auth/me`, { withCredentials: true })
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/auth/logout`, {}, { withCredentials: true })
  }

  getDemoMessage(): Observable<DemoResponse> {
    return this.http.get<DemoResponse>(`${this.apiBase}/demo/message`, { withCredentials: true })
  }
}
