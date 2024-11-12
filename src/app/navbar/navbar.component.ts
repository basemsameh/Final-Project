import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isStudentLogin: any;
  isLoginedBefore: any;
  loginedUser: any;
  profileImageUrl: any;
  notificNumber: any;

  ngOnInit(): void {
    let storedData = localStorage.getItem('loginedUser');
    storedData
      ? (this.loginedUser = JSON.parse(storedData))
      : (this.loginedUser = []);

    this._DataService.isStudentLogin.subscribe((x: any) => {
      this.isStudentLogin = x;
      this.cdRef.detectChanges();
    });

    this._DataService.isLoginedBefore.subscribe((x: any) => {
      this.isLoginedBefore = x;
      this.cdRef.detectChanges();
    });

    this._DataService.profileImageUrl.subscribe((x: any) => {
      this.profileImageUrl = x;
      this.cdRef.detectChanges();
    });

    // Get number of motifications based on current logined user
    this.notificNumber = this.getNumberOfNotific();
  }

  constructor(
    private _Router: Router,
    private _DataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {}

  // Get number of motifications based on current logined user
  getNumberOfNotific(): number {
    let notifics = this.loginedUser.notifications;
    let unReadedNotific = 0;
    if (notifics) {
      if (notifics.lenght !== 0) {
        for (let i = 0; i < notifics.length; i++) {
          if (!notifics[i].readed) {
            unReadedNotific += 1;
          }
        }
      }
    }
    return unReadedNotific;
  }

  navigateToProfile() {
    this._Router.navigate(['profile']);
  }

  logOut() {
    this._Router.navigate(['login']);
    this.isLoginedBefore = false;
    localStorage.setItem(
      'isLoginedBefore',
      JSON.stringify(this.isLoginedBefore)
    );
    this.isStudentLogin = false;
    localStorage.setItem('isStudentLogin', JSON.stringify(this.isStudentLogin));
    localStorage.removeItem('loginedUser');
  }
}
