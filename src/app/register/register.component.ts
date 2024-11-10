import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  users: any;
  ngOnInit(): void {
    let storedData = localStorage.getItem('users');
    this.users = storedData ? (this.users = JSON.parse(storedData)) : [];
  }

  registerForm = new FormGroup({
    fname: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    lname: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl(null, [Validators.email, Validators.required]),
    birthdate: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([0-9]{4})$'
      ),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
    confirmPass: new FormControl(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      ),
    ]),
    isStudent: new FormControl(null, [Validators.required]),
    gender: new FormControl(null, [Validators.required]),
    phoneNum: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\d{11}$/),
    ]),
  });

  // Submit data and Update users value then send it to localStorage
  submitData(form: any) {
    let user = {
      id: this.getIdNumber(),
      fname: form.controls.fname.value,
      lname: form.controls.lname.value,
      email: form.controls.email.value,
      phoneNum: form.controls.phoneNum.value,
      birthdate: form.controls.birthdate.value,
      gender: form.controls.gender.value,
      password: form.controls.confirmPass.value,
      exams: [],
      status: form.controls.isStudent.value,
      profileImageUrl: '../../assets/images/account.png',
      notifications: [],
    };
    this.users[0][`${user.status}s`].push(user);

    localStorage.setItem('users', JSON.stringify(this.users));
  }

  // Get Id number to the new user
  getIdNumber(): any {
    let idNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
    let testOne = this.checkIdUsedOrNot(this.users[0].students, idNum);
    let testTwo = this.checkIdUsedOrNot(this.users[0].instructors, idNum);
    if (testOne === false || testTwo === false) {
      this.getIdNumber();
    } else {
      return idNum;
    }
  }

  // Check if ID number is exist before or not
  checkIdUsedOrNot(array: any[], idNum: number) {
    let validId;
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === idNum) {
        validId = false;
        break;
      } else {
        validId = true;
      }
    }
    return validId;
  }

  // Show and hide password
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

  // Check value of password is equal to value of confirm password
  checkSamePassword(inpt1: HTMLInputElement, inpt2: HTMLInputElement) {
    return inpt1.value === inpt2.value ? true : false;
  }

  constructor(private _Router: Router) {}
  navigateToLogin() {
    this._Router.navigate(['login']);
  }
}
