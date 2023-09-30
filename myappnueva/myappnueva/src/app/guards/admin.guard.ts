import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';


import { RoleServiceService } from '../services/role-service.service';

@Injectable({
  providedIn: 'root'
})
export  default class AdminGuard implements CanActivate {
  [x: string]: any;
  constructor(private role: RoleServiceService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.role.isAdmin()) {
      return true;
    }

    return this.router.parseUrl('/access-denied');
  }
}
