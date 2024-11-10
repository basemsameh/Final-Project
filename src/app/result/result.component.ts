import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router
  ) {}

  loginedUser: any;
  examIndex: any;
  examReport: any;
  nameOfExam: any;

  getExamIndex(str: string) {
    let exams = this.loginedUser.exams;
    for (let i = 0; i < exams.length; i++) {
      let temName = Object.keys(exams[i])[0];
      if (temName === str) {
        this.examIndex = i;
        break;
      } else continue;
    }
  }

  ngOnInit(): void {
    this.nameOfExam = this._ActivatedRoute.snapshot.params['exam'];

    let currentUser = localStorage.getItem('loginedUser');
    currentUser ? (this.loginedUser = JSON.parse(currentUser)) : [];

    // Get index of exam
    this.getExamIndex(this.nameOfExam);
    this.examReport = this.loginedUser.exams[this.examIndex][this.nameOfExam];
  }

  getNavigation(exam: number) {
    this._Router.navigate(['exams', exam]);
  }
}
