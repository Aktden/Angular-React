import { Component, OnInit, inject } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { firstValueFrom } from 'rxjs'
import { AuthService } from './auth.service'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="page-shell">
      <header class="topbar">
        <a class="brand" href="/angular/" aria-label="HybridApp Angular home">
          <span class="brand-mark">H</span>
          <span>HybridApp</span>
        </a>
        <span class="client-label">Angular client</span>
      </header>

      <section class="hero">
        <p class="eyebrow">ONE BACKEND · TWO FRONTENDS</p>
        <h1>Angular-клиент<br /><span>того же API.</span></h1>
        <p class="hero-copy">
          Это отдельное приложение Angular. В production оно размещается на том же origin,
          что и React, и использует ту же cookie авторизации.
        </p>
        <div class="route-pills">
          <a href="/">/ — React ↗</a>
          <span>/angular/ — Angular</span>
          <span>/api — ASP.NET Core</span>
        </div>
      </section>

      <section class="auth-card" aria-labelledby="auth-title">
        <div class="card-heading">
          <div>
            <p class="eyebrow">AUTHENTICATION</p>
            <h2 id="auth-title">Проверка общей сессии</h2>
          </div>
          <span class="status-dot" [class.is-online]="!!currentUser"></span>
        </div>

        @if (loading) {
          <p class="muted">Проверяем сессию…</p>
        } @else if (currentUser) {
          <div class="signed-in">
            <p class="muted">Вы вошли как</p>
            <strong class="user-name">{{ currentUser }}</strong>
            <p class="api-message">{{ message || 'Авторизация подтверждена сервером.' }}</p>
            <div class="button-row">
              <button class="button button-secondary" type="button" (click)="refreshSession()" [disabled]="busy">
                Проверить сессию
              </button>
              <button class="button button-primary" type="button" (click)="logout()" [disabled]="busy">
                {{ busy ? 'Подождите…' : 'Выйти' }}
              </button>
            </div>
          </div>
        } @else {
          <form class="login-form" (ngSubmit)="login()">
            <label>
              Логин
              <input name="username" [(ngModel)]="username" autocomplete="username" required />
            </label>
            <label>
              Пароль
              <input name="password" [(ngModel)]="password" type="password" autocomplete="current-password" required />
            </label>
            @if (error) {
              <p class="error-message" role="alert">{{ error }}</p>
            }
            <button class="button button-primary submit-button" type="submit" [disabled]="busy">
              {{ busy ? 'Выполняется вход…' : 'Войти' }}
            </button>
            <p class="form-hint">Демо-доступ: <code>demo</code> / <code>Demo123!</code></p>
          </form>
        }
        @if (currentUser && error) {
          <p class="error-message" role="alert">{{ error }}</p>
        }
      </section>

      <footer class="page-footer">
        <span>ASP.NET Core Web API</span>
        <span>CookieAuthentication · HttpOnly · SameSite=Lax</span>
      </footer>
    </main>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly auth = inject(AuthService)

  username = 'demo'
  password = ''
  currentUser: string | null = null
  message = ''
  error = ''
  busy = false
  loading = true

  ngOnInit(): void {
    void this.loadSession()
  }

  async login(): Promise<void> {
    if (this.busy) return
    this.busy = true
    this.error = ''

    try {
      const user = await firstValueFrom(this.auth.login(this.username, this.password))
      this.currentUser = user.username
      this.password = ''
      await this.loadMessage()
    } catch (error: unknown) {
      this.currentUser = null
      this.error = this.getErrorMessage(error, 'Не удалось выполнить вход.')
    } finally {
      this.busy = false
    }
  }

  async logout(): Promise<void> {
    if (this.busy) return
    this.busy = true
    this.error = ''

    try {
      await firstValueFrom(this.auth.logout())
      this.currentUser = null
      this.message = ''
    } catch (error: unknown) {
      this.error = this.getErrorMessage(error, 'Не удалось выйти.')
    } finally {
      this.busy = false
    }
  }

  async refreshSession(): Promise<void> {
    this.error = ''
    try {
      const user = await firstValueFrom(this.auth.me())
      this.currentUser = user.username
      await this.loadMessage()
    } catch (error: unknown) {
      this.currentUser = null
      this.message = ''
      this.error = this.getErrorMessage(error, 'Сессия не найдена.')
    }
  }

  private async loadSession(): Promise<void> {
    try {
      const user = await firstValueFrom(this.auth.me())
      this.currentUser = user.username
      await this.loadMessage()
    } catch {
      this.currentUser = null
    } finally {
      this.loading = false
    }
  }

  private async loadMessage(): Promise<void> {
    const result = await firstValueFrom(this.auth.getDemoMessage())
    this.message = result.message
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = (error.error as { message?: string } | null)?.message
      return message ?? `${fallback} Код ответа: ${error.status}.`
    }
    return error instanceof Error ? error.message : fallback
  }
}
