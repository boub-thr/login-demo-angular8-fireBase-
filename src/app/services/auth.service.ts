import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { throwError, BehaviorSubject } from 'rxjs'
import { User } from '../model/user';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpirationTimer: any ;
  userSub = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, pswd: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDCTLgztHwdmXlk1QkTbnUBS87ZyZD60ic',
      {
        email: email,
        password: pswd,
        returnSecureToken: true
      }
    )
      .pipe(catchError(errorRes => {
        return throwError(this.customError(errorRes));
      }),
        tap((resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }))
      );
  }

  signin(email: string, pswd: string) {
    return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDCTLgztHwdmXlk1QkTbnUBS87ZyZD60ic",
      {
        email: email,
        password: pswd,
        returnSecureToken: true
      })
      .pipe(catchError(errorRes => {
        return throwError(this.customError(errorRes));
      }),
        tap((resData => {
          this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }))
      )
      ;
  }

  logout() {
    this.userSub.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
  }

  autoSignin() {
    const uData: { email: string; id: string; _token: string; _tokenExpirationDate: string; } = JSON.parse(localStorage.getItem('userData'));
    if (!uData) {
      return;
    }
    const loadedUser = new User(uData.email, uData.id, uData._token, new Date(uData._tokenExpirationDate));
    if (loadedUser.token) {
      this.userSub.next(loadedUser);
      const expirationDuration = new Date(uData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirartionDuration: number) {
    this.tokenExpirationTimer=setTimeout( () => {
      this.logout();
    },expirartionDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + (expiresIn * 1000));
    const user = new User(email, userId, token, expirationDate);
    this.userSub.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private customError(errorRes: HttpErrorResponse): string {
    let errorMsg = "an unknow error occurred !!"
    if (!errorRes.error || !errorRes.error.error) {
      return errorMsg;
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = "This Email exist already !!";
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMsg = "Password sign-in is disabled !!";
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMsg = "We have blocked all requests from this device due to unusual activity. Try again later. !!";
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = "There is no user record corresponding to this identifier. !!";
        break;
      case 'INVALID_PASSWORD':
        errorMsg = "The password is invalid . !!";
        break;
      case 'USER_DISABLED':
        errorMsg = "The user account has been disabled by an administrator. !!";
        break;
    }
    return errorMsg;
  }
}