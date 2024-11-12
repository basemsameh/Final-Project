import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataService } from './data.service';

export const dataGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let dataService = inject(DataService);
  let isLoginedBefore;
  dataService.isLoginedBefore.subscribe((x) => {
    isLoginedBefore = x;
  });

  if (isLoginedBefore) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
