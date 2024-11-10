import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  constructor(private _Router: Router, private _DataService: DataService) {}

  users: any;
  loginedUser: any;
  profileImageUrl: any;
  updateForm: any;
  progressPercentage: any;
  namesOfExams: any;
  showResetPass: boolean = false;
  messages: any;
  isLoginedBefore: any;
  isStudentLogin: any;

  ngOnInit(): void {
    let storedStudent = localStorage.getItem('isStudentLogin');
    storedStudent
      ? (this.isStudentLogin = JSON.parse(storedStudent))
      : (this.isStudentLogin = false);

    let storedLogined = localStorage.getItem('isLoginedBefore');
    storedLogined
      ? (this.isLoginedBefore = JSON.parse(storedLogined))
      : (this.isLoginedBefore = false);

    let storedData = localStorage.getItem('loginedUser');
    storedData ? (this.loginedUser = JSON.parse(storedData)) : [];

    this.profileImageUrl = this.loginedUser.profileImageUrl;

    let storedUsers = localStorage.getItem('users');
    storedUsers ? (this.users = JSON.parse(storedUsers)) : [];

    this._DataService.getMessages().subscribe((msgs) => {
      this.messages = msgs;
      console.log(this.messages);
    });

    // Form Group
    this.updateForm = new FormGroup({
      fname: new FormControl(this.loginedUser.fname, [
        Validators.required,
        Validators.minLength(3),
      ]),
      lname: new FormControl(this.loginedUser.lname, [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl(this.loginedUser.email, [
        Validators.required,
        Validators.email,
      ]),
      birthdate: new FormControl(this.loginedUser.birthdate, [
        Validators.required,
        Validators.pattern(
          '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/([0-9]{4})$'
        ),
      ]),
      phoneNum: new FormControl(this.loginedUser.phoneNum, [
        Validators.required,
        Validators.pattern(/^\d{11}$/),
      ]),
      password: new FormControl(this.loginedUser.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      newPassword: new FormControl(this.loginedUser.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      confirmPass: new FormControl(this.loginedUser.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
    });
  }

  // Show and hide password is value
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

  checkSamePassword(inpt1: HTMLInputElement, inpt2: HTMLInputElement) {
    return inpt1.value === inpt2.value ? true : false;
  }

  // Change Photo of User
  changePhoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      // Load the selected image and update the profileImageUrl
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file); // Convert file to base64 URL
    }
  }

  // Save Changes
  saveChanges() {
    this.loginedUser.profileImageUrl = this.profileImageUrl;
    this.loginedUser.fname = this.updateForm.controls.fname.value;
    this.loginedUser.lname = this.updateForm.controls.lname.value;
    this.editMessage();
    this.loginedUser.email = this.updateForm.controls.email.value;
    this.loginedUser.birthdate = this.updateForm.controls.birthdate.value;
    this.loginedUser.phoneNum = this.updateForm.controls.phoneNum.value;
    this.loginedUser.password = this.updateForm.controls.confirmPass.value;
    if (this.loginedUser.status === 'student') {
      let students = this.users[0].students;
      for (let i = 0; i < students.length; i++) {
        if (students[i].id === this.loginedUser.id) {
          students[i].profileImageUrl = this.profileImageUrl;
          students[i].fname = this.loginedUser.fname;
          students[i].lname = this.loginedUser.lname;
          students[i].email = this.loginedUser.email;
          students[i].birthdate = this.loginedUser.birthdate;
          students[i].phoneNum = this.loginedUser.phoneNum;
          students[i].password = this.updateForm.controls.confirmPass.value;
        } else continue;
      }
    } else {
      let instructors = this.users[0].instructors;
      for (let i = 0; i < instructors.length; i++) {
        if (instructors[i].id === this.loginedUser.id) {
          instructors[i].profileImageUrl = this.profileImageUrl;
          instructors[i].fname = this.loginedUser.fname;
          instructors[i].lname = this.loginedUser.lname;
          instructors[i].email = this.loginedUser.email;
          instructors[i].birthdate = this.loginedUser.birthdate;
          instructors[i].phoneNum = this.loginedUser.phoneNum;
          instructors[i].password = this.updateForm.controls.confirmPass.value;
        } else continue;
      }
    }
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('loginedUser', JSON.stringify(this.loginedUser));
  }

  // Change photo that in discussion
  editMessage() {
    let fullName = `${this.loginedUser.fname} ${this.loginedUser.lname}`;
    this._DataService.updateMessage(
      this.loginedUser.id,
      this.loginedUser.profileImageUrl,
      fullName
    );
  }

  // Delete current photo and return to the initial photo
  deletePhoto() {
    this.profileImageUrl = '../../assets/images/account.png';
    this.loginedUser.profileImageUrl = this.profileImageUrl;
  }

  reloadPage() {
    location.reload();
  }

  navigateToResult(exam: number) {
    this._Router.navigate(['exams', exam]);
  }

  // Log out
  logOut() {
    this._Router.navigate(['login']);
    this._DataService.isLoginedBefore.next(false);
    this.isLoginedBefore = false;
    localStorage.setItem(
      'isLoginedBefore',
      JSON.stringify(this.isLoginedBefore)
    );
    this._DataService.isStudentLogin.next(false);
    this.isStudentLogin = false;
    localStorage.setItem('isStudentLogin', JSON.stringify(this.isStudentLogin));
    localStorage.removeItem('loginedUser');
  }

  // Display progress of each solved exam
  getProgressColor(percentage: number): string {
    if (percentage >= 81) {
      return '#33cc33'; // Green for 81% to 100%
    } else if (percentage >= 61) {
      return '#3399ff'; // Blue for 61% to 80%
    } else if (percentage >= 31) {
      return '#ffd633'; // Yellow for 31% to 60%
    } else {
      return '#ff4d4d'; // Red for 0% to 30%
    }
  }

  getExamsNames(index: number) {
    // Get the keys
    this.namesOfExams = Object.keys(this.loginedUser.exams[index])[0];
    return this.namesOfExams;
  }

  // Reset Password
  resetPassword(btn: HTMLButtonElement) {
    this.updateForm.controls.newPassword.value = '';
    this.updateForm.controls.confirmPass.value = '';
    this.showResetPass = true;
    btn.disabled = true;
  }
}
