import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private _Router: Router, private _DataService: DataService) {}

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  toggleEye(btn: HTMLButtonElement, passInput: HTMLInputElement) {
    let icon = btn.children[0];
    if (icon.classList.contains('fa-eye-slash')) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
      passInput.setAttribute('type', 'text');
    } else {
      icon.classList.add('fa-eye-slash');
      icon.classList.remove('fa-eye');
      passInput.setAttribute('type', 'password');
    }
  }

  isStudentLogin: any = this.saveStudentData();
  saveStudentData() {
    let storedData = localStorage.getItem('isStudentLogin');
    if (storedData !== null) {
      this.isStudentLogin = JSON.parse(storedData);
    } else {
      this.isStudentLogin = false;
      localStorage.setItem(
        'isStudentLogin',
        JSON.stringify(this.isStudentLogin)
      );
    }
    return this.isStudentLogin;
  }

  isLoginedBefore: any = this.saveLoginData();
  saveLoginData() {
    let storedData = localStorage.getItem('isLoginedBefore');
    if (storedData !== null) {
      this.isLoginedBefore = JSON.parse(storedData);
    } else {
      this.isLoginedBefore = false;
      localStorage.setItem(
        'isLoginedBefore',
        JSON.stringify(this.isLoginedBefore)
      );
    }
    return this.isLoginedBefore;
  }

  loginedUser: any;
  users: any = this.getUsersData();
  getUsersData() {
    let storedData = localStorage.getItem('users');
    if (storedData !== null) {
      this.users = JSON.parse(storedData);
    } else {
      this.users = [
        {
          students: [],
          instructors: [],
        },
      ];
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    return this.users;
  }

  // Return valid email and password or not. Once for students & once
  // for instructors
  loopOnData(
    array: any[],
    emailInpt: HTMLInputElement,
    passInput: HTMLInputElement
  ) {
    let validEmail = false;
    let validPassword = false;
    if (array.length !== 0) {
      for (let i = 0; i < array.length; i++) {
        if (emailInpt.value === array[i].email) {
          validEmail = true;
          if (passInput.value === array[i].password) {
            validPassword = true;
            this.loginedUser = array[i];
            localStorage.setItem(
              'loginedUser',
              JSON.stringify(this.loginedUser)
            );
            break;
          }
        }
      }
      return validEmail === true && validPassword === true ? true : false;
    } else {
      return false;
    }
  }

  showWrongEmailOrPass = false;
  checkLoginData() {
    let emailInpt = document.querySelector(
      "input[type='email']"
    ) as HTMLInputElement;

    let passInput = document.querySelector(
      "input[type='password']"
    ) as HTMLInputElement;

    let isDataInStudents = this.loopOnData(
      this.users[0].students,
      emailInpt,
      passInput
    );
    let isDataInInstructors = this.loopOnData(
      this.users[0].instructors,
      emailInpt,
      passInput
    );

    if (isDataInStudents === true || isDataInInstructors === true) {
      this.isLoginedBefore = true;
      localStorage.setItem(
        'isLoginedBefore',
        JSON.stringify(this.isLoginedBefore)
      );
      this._DataService.isLoginedBefore.next(true);
      if (isDataInStudents === true) {
        this.isStudentLogin = true;
        localStorage.setItem(
          'isStudentLogin',
          JSON.stringify(this.isStudentLogin)
        );
        this._DataService.isStudentLogin.next(true);
      } else {
        this.isStudentLogin = false;
        localStorage.setItem(
          'isStudentLogin',
          JSON.stringify(this.isStudentLogin)
        );
        this._DataService.isStudentLogin.next(false);

        this._DataService.profileImageUrl.next(
          this.loginedUser.profileImageUrl
        );
      }
      this.navigateToExams();
    } else {
      this.showWrongEmailOrPass = true;
      passInput.value = '';
    }
  }

  navigateToExams() {
    this._Router.navigate(['exams']);
  }

  navToRegister() {
    this._Router.navigate(['register']);
  }
}
