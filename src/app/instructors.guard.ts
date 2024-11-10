import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from './data.service';

export const instructorsGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let dataService = inject(DataService);
  let isStudentLogin;
  dataService.isStudentLogin.subscribe((x) => {
    isStudentLogin = x;
  });

  if (!isStudentLogin) {
    return true;
  } else {
    router.navigate(['discussion']);
    return false;
  }
};
