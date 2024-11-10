import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  loginedUser: any;
  users: any;
  unreadIndexes: any[] = [];
  unreadedNot: any[] = [];
  constructor(private _Router: Router, private _DataService: DataService) {}

  ngOnInit(): void {
    this.loginedUser = JSON.parse(localStorage.getItem('loginedUser')!);
    this.users = JSON.parse(localStorage.getItem('users')!);
  }

  // Mark all notifications as read
  markAllAsRead() {
    let notifc = this.loginedUser.notifications;
    for (let i = 0; i < notifc.length; i++) {
      notifc[i].readed = true;
    }
    let students = this.users[0].students;
    let instructors = this.users[0].instructors;
    this.loginedUser.status === 'student'
      ? this.updateCurrentUserNotifics(students)
      : this.updateCurrentUserNotifics(instructors);
    this._DataService.notificNumber.next(0);
    localStorage.setItem('loginedUser', JSON.stringify(this.loginedUser));
    localStorage.setItem('users', JSON.stringify(this.users));
    location.reload();
  }

  // Update notifications of the current user after (make all as read) to be equal
  // notifications that in(loginedUser)
  updateCurrentUserNotifics(array: any[]): void {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === this.loginedUser.id) {
        array[i] = this.loginedUser;
        break;
      }
    }
  }

  // Navigate to exams page
  navigateToExams() {
    this._Router.navigate(['exams']);
  }
}
