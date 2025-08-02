import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { environment as AppData } from '../../environments/environment';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  let router = inject(Router);
  const API_TOKEN = localStorage.getItem(AppData.localStoragetoken);

  if (API_TOKEN) {
    try {
      let decodedToken = jwtDecode(API_TOKEN);
      const isExpired =
        decodedToken && decodedToken.exp
          ? decodedToken.exp < Date.now() / 1000
          : false;

      if (isExpired) {
        localStorage.removeItem(AppData.localStoragetoken);
        router.navigateByUrl('/login');
      } else {
        
        const headers = req.headers
          
          .set('Authorization', `Bearer ${API_TOKEN}`);

        const cloneReq = req.clone({
          headers
        });
        
        return next(cloneReq);
      }

    } catch (error) {
      
      localStorage.removeItem(AppData.localStoragetoken);
      router.navigateByUrl('/login');
    }
  }
  return next(req);
};
