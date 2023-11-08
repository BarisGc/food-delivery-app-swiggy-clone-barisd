import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Strings } from 'src/app/enum/strings.enum';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {

  constructor(
    private authService: AuthService, 
    private router: Router) {}


  async canLoad(
    route: Route,
    segments: UrlSegment[]): Promise<boolean> {
      try {
        const val = await this.authService.getId();
        console.log(val);
        if(val) {
          this.router.navigateByUrl(Strings.TABS, {replaceUrl: true});
          return false;
        } else {
          return true;
        }
      } catch(e) {
        console.log(e);
        return true;
      }
  }

}
