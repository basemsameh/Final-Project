import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.css',
})
export class ExamsComponent implements OnInit {
  constructor(
    private _Router: Router,
    private _DataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {}

  notFoundExams: boolean = true;
  loginedUser: any;
  isStudentLogin: any;
  users: any;

  examsSended: any;
  getDataToExamForm() {
    let storedData = localStorage.getItem('examsSended');
    if (storedData !== null && JSON.parse(storedData).length > 0) {
      this.examsSended = JSON.parse(storedData);
      this.notFoundExams = false; // Only set to false if exams exist
    } else {
      this.examsSended = [];
      this.notFoundExams = true; // Set to true if no exams are found
    }
    return this.examsSended;
  }

  ngOnInit(): void {
    this._DataService.isStudentLogin.subscribe((x: any) => {
      this.isStudentLogin = x;
      this.cdRef.detectChanges(); // Manually trigger change detection
    });

    this.examsSended = this.getDataToExamForm();

    let storedData = localStorage.getItem('loginedUser');
    storedData ? (this.loginedUser = JSON.parse(storedData)) : [];

    let storedUsers = localStorage.getItem('users');
    storedUsers ? (this.users = JSON.parse(storedUsers)) : (this.users = []);

    this.getDataToExamForm();
  }

  checkSolvedBefore(): any[] {
    let arrIndexs = [];
    if (this.loginedUser?.exams?.length !== 0) {
      for (let i = 0; i < this.examsSended.length; i++) {
        if (this.loginedUser.exams[i]) {
          for (let k = 0; k < this.examsSended.length; k++) {
            if (this.loginedUser.exams[i][this.examsSended[k].examName]) {
              arrIndexs.push(k);
            }
          }
        }
      }
    }
    return arrIndexs;
  }

  solved(index: number) {
    const isSolvedBefore = this.checkSolvedBefore();
    if (isSolvedBefore) {
      return isSolvedBefore.includes(index) ? true : false;
    } else {
      return false;
    }
  }

  // Update date in localStorgae for examsSended
  saveData() {
    localStorage.setItem('examsSended', JSON.stringify(this.examsSended));
  }

  // Delete Exam
  deleteExam(index: number) {
    // Update the `notFoundExams` status based on the length of `examsSended`
    this.notFoundExams = this.examsSended.length === 0;
    // Remove this exam from exams that in students
    let examName = this.examsSended[index].examName;
    let students = this.users[0].students;
    for (let i = 0; i < students.length; i++) {
      for (let k = 0; k < students[i].exams.length; k++) {
        if (students[i].exams[k][examName]) {
          students[i].exams.splice(k, 1);
          localStorage.setItem('users', JSON.stringify(this.users));
          if (students[i].id === this.loginedUser.id) {
            this.loginedUser.exams = students[i].exams;
            localStorage.setItem(
              'loginedUser',
              JSON.stringify(this.loginedUser)
            );
          }
          break;
        }
      }
    }

    // Notifications
    // [1] Students
    for (let i = 0; i < students.length; i++) {
      students[i].notifications.unshift({
        message: `<strong>${examName}</strong> has been deleted from exams list by instructor <strong>${this.loginedUser.fname} ${this.loginedUser.lname}</strong>. 
        Check from your exams in account page`,
        readed: false,
      });
    }

    // [2] Instructors
    let instructors = this.users[0].instructors;
    for (let i = 0; i < instructors.length; i++) {
      instructors[i].notifications.unshift({
        message: `<strong>${examName}</strong> has been deleted from exams list by instructor <strong>${this.loginedUser.fname} ${this.loginedUser.lname}</strong>.`,
        readed: false,
      });
    }

    localStorage.setItem('users', JSON.stringify(this.users));
    this.examsSended.splice(index, 1);
    this.saveData();
  }

  text: string = '';
  handleText(t: string) {
    if (this.text.length !== 0) {
      t = t.replace(new RegExp(this.text, 'gi'), `<mark>${this.text}</mark>`);
    }
    return t;
  }

  getNavigation(exam: string) {
    this._DataService.instructorShowAns.next(false);
    this._Router.navigate(['exams', exam]);
  }

  updateExam(index: number) {
    localStorage.setItem('examForm', JSON.stringify(this.examsSended[index]));
    let examName = this.examsSended[index].examName;

    // Notifications
    let students = this.users[0].students;
    for (let i = 0; i < students.length; i++) {
      students[i].notifications.unshift({
        message: `<strong>${examName}</strong> has been deleted from exams list by instructor <strong>${this.loginedUser.fname} ${this.loginedUser.lname}</strong>. 
        Check from your exams in account page.`,
        readed: false,
      });
    }

    // Instructors
    let instructors = this.users[0].instructors;
    for (let i = 0; i < instructors.length; i++) {
      instructors[i].notifications.unshift({
        message: `<strong>${examName}</strong> has been deleted from exams list by instructor <strong>${this.loginedUser.fname} ${this.loginedUser.lname}</strong>.`,
        readed: false,
      });
    }

    localStorage.setItem('users', JSON.stringify(this.users));
    this.examsSended.splice(index, 1);
    this.saveData();
    this._Router.navigate(['creation']);
  }

  navigateToResponses(examName: string) {
    this._Router.navigate(['responses', examName]);
  }
}
