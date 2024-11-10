import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from './data.service';

export const studentsGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let isStudentLogin;
  let dataService = inject(DataService);
  dataService.isStudentLogin.subscribe((x) => {
    isStudentLogin = x;
  });

  if (isStudentLogin) {
    return true;
  } else {
    router.navigate(['discussion']);
    return false;
  }
};
