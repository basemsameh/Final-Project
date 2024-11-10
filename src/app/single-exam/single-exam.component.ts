import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-single-exam',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './single-exam.component.html',
  styleUrls: ['./single-exam.component.css'],
})
export class SingleExamComponent implements OnInit {
  examsSended: any;
  examForm: any;
  users: any;
  isStudentLogin: any;
  loginedUser: any;
  examIndex: any;
  examModelAnswer: any;
  instructorShowAns: any;

  isEnded: boolean = false;
  checkSolvedBefore() {
    if (this.isStudentLogin) {
      let exams = this.loginedUser.exams;
      for (let i = 0; i < exams.length; i++) {
        let answrsExist = exams[i][this.examForm.examName];
        if (answrsExist !== undefined) {
          this.isEnded = true;
          this.studentAnswers = answrsExist;
          localStorage.setItem(
            'studentAnswers',
            JSON.stringify(this.studentAnswers)
          );
          break;
        } else {
          this.isEnded = false;
        }
      }
    } else {
      if (this.instructorShowAns) {
        let students = this.users[0].students;
        let currentUser;
        let idNumber;
        this._DataService.stdIdNumber.subscribe((x) => {
          idNumber = x;
        });
        for (let i = 0; i < students.length; i++) {
          if (students[i].id === idNumber) {
            currentUser = students[i];
            break;
          }
        }
        let exams = currentUser.exams;
        for (let i = 0; i < exams.length; i++) {
          let answrsExist = exams[i][this.examForm.examName];
          if (answrsExist !== undefined) {
            this.isEnded = true;
            this.studentAnswers = answrsExist;
            localStorage.setItem(
              'studentAnswers',
              JSON.stringify(this.studentAnswers)
            );
            break;
          }
        }
      } else {
        this.studentAnswers = this.getStudentAnswers();
      }
    }
  }

  studentAnswers: any;
  getStudentAnswers() {
    let storedData = localStorage.getItem('studentAnswers');
    if (storedData) {
      this.studentAnswers = JSON.parse(storedData);
    } else {
      this.studentAnswers = {
        name: `${this.loginedUser.fname} ${this.loginedUser.lname}`,
        email: this.loginedUser.email,
        id: this.loginedUser.id,
        endingTime: '',
        completedDate: '',
        score: '',
        grade: '',
        percent: 0,
        allAnswers: [],
      };
      for (let i = 0; i < this.examForm.questions.length; i++) {
        this.studentAnswers.allAnswers.push({
          answers: [],
        });
      }
      localStorage.setItem(
        'studentAnswers',
        JSON.stringify(this.studentAnswers)
      );
    }
    return this.studentAnswers;
  }

  getExamIndex(str: string) {
    for (let i = 0; i < this.examsSended.length; i++) {
      if (this.examsSended[i].examName === str) {
        this.examIndex = i;
      } else continue;
    }
  }

  navigateToResponses(examName: string) {
    this._Router.navigate(['responses', examName]);
  }

  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _DataService: DataService
  ) {}
  ngOnInit() {
    // Current User that logined
    let currentUser = localStorage.getItem('loginedUser');
    currentUser ? (this.loginedUser = JSON.parse(currentUser)) : {};

    let examsStored = localStorage.getItem('examsSended');
    examsStored ? (this.examsSended = JSON.parse(examsStored)) : null;

    this.getExamIndex(this._ActivatedRoute.snapshot.params['exam']);
    this.examForm = this.examsSended[this.examIndex];

    let storedData = localStorage.getItem('isStudentLogin');
    storedData ? (this.isStudentLogin = JSON.parse(storedData)) : false;

    // Users
    let usersData = localStorage.getItem('users');
    usersData ? (this.users = JSON.parse(usersData)) : {};

    // Get examsSended from localStorage
    let storedExams = localStorage.getItem('examsSended');
    storedExams
      ? (this.examModelAnswer =
          JSON.parse(storedExams)[this.examIndex].modelAnswer)
      : [];

    this.countDown(); // Start the countdown
    this.studentAnswers = this.getStudentAnswers();
    this.stdAnswersSended = this.getStdAnswers();
    // result/Testing%20Exam

    this._DataService.instructorShowAns.subscribe(
      (x) => (this.instructorShowAns = x)
    );

    this.checkSolvedBefore();
  }

  saveStudentAns() {
    localStorage.setItem('studentAnswers', JSON.stringify(this.studentAnswers));
  }

  checkInputType(type: string, index: number, answerIndex: number) {
    let answer = this.examForm.questions[index].answers[answerIndex];
    let modelAnswers = this.studentAnswers.allAnswers[index].answers;
    if (type === 'radio') {
      modelAnswers[0] = answer;
    } else {
      modelAnswers.includes(answer)
        ? modelAnswers.splice(modelAnswers.indexOf(answer), 1)
        : modelAnswers.push(answer);
    }
    this.saveStudentAns();
  }

  // Timer
  seconds: number = 0;
  countDown() {
    let timer = setInterval(() => {
      if (this.seconds === 0 && this.examForm.timeLimit === 0) {
        clearInterval(timer);
        this.endExam();
      }
      if (this.seconds === 0) {
        this.seconds = 59;
        this.examForm.timeLimit -= 1;
      } else {
        this.seconds -= 1;
      }
    }, 1000);
  }

  stdAnswersSended: any;
  getStdAnswers() {
    let storedData = localStorage.getItem('stdAnswersSended');
    if (storedData) {
      this.stdAnswersSended = JSON.parse(storedData);
      let currentName = this.stdAnswersSended[this.examForm.examName];
      if (!currentName) {
        this.stdAnswersSended[`${this.examForm.examName}`] = [];
        localStorage.setItem(
          'stdAnswersSended',
          JSON.stringify(this.stdAnswersSended)
        );
      }
    } else {
      this.stdAnswersSended = { [`${this.examForm.examName}`]: [] };
      localStorage.setItem(
        'stdAnswersSended',
        JSON.stringify(this.stdAnswersSended)
      );
    }
    return this.stdAnswersSended;
  }

  // Score Points
  checkCorrectAnswers() {
    let countPoints = 0;
    let modelAns = this.examModelAnswer;
    let stdAns = this.studentAnswers.allAnswers;
    for (let i = 0; i < modelAns.length; i++) {
      let multibleAns = [];
      // Loop through student answers for the current question
      for (let k = 0; k < stdAns[i].answers.length; k++) {
        // Single-answer question
        if (stdAns[i].answers.length === 1) {
          if (modelAns[i].answers.includes(stdAns[i].answers[k])) {
            countPoints += 1; // Correct answer, increment points
          }
        } else {
          // Multiple-answer question
          if (modelAns[i].answers.includes(stdAns[i].answers[k])) {
            multibleAns.push(true); // Correct answer found
          } else {
            multibleAns.push(false); // Incorrect answer found
          }
        }
      }
      // If all the multiple answers are correct, increment points
      if (multibleAns.length > 0 && !multibleAns.includes(false)) {
        countPoints += 1;
      }
    }
    this.studentAnswers.percent =
      (countPoints * 100) / this.examForm.questions.length;
    return `${countPoints} / ${this.examForm.questions.length}`;
  }

  // End Exam
  endExam() {
    let timerMinutes = document.querySelector('.timerMinutes');
    let timerSeconds = document.querySelector('.timerSeconds');
    this.studentAnswers.completedDate = this.formatDate();
    this.studentAnswers.score = this.checkCorrectAnswers();
    this.studentAnswers.grade = this.grade(this.studentAnswers.score);
    this.studentAnswers.endingTime = `${timerMinutes?.textContent}:${timerSeconds?.textContent}`;
    // Update current user is data
    this.loginedUser.exams.push({
      [`${this.examForm.examName}`]: this.studentAnswers,
    });
    localStorage.setItem('loginedUser', JSON.stringify(this.loginedUser));
    // Update Users are data
    for (let i = 0; i < this.users[0].students.length; i++) {
      if (this.users[0].students[i].id === this.loginedUser.id) {
        this.users[0].students[i].exams.push({
          [`${this.examForm.examName}`]: this.studentAnswers,
        });
        break;
      } else continue;
    }
    localStorage.setItem('users', JSON.stringify(this.users));
    this.stdAnswersSended[`${this.examForm.examName}`].push(
      this.studentAnswers
    );
    localStorage.setItem(
      'stdAnswersSended',
      JSON.stringify(this.stdAnswersSended)
    );

    let examName = this.examsSended[this.examIndex].examName;

    // Notifications
    // Instructors
    let studentName = `${this.loginedUser.fname} ${this.loginedUser.lname}`;
    let instructors = this.users[0].instructors;
    for (let i = 0; i < instructors.length; i++) {
      instructors[i].notifications.unshift({
        message: `Student <strong>${studentName}</strong> response to the <strong>${examName}</strong>.`,
        readed: false,
      });
    }

    localStorage.setItem('users', JSON.stringify(this.users));
    this.removeAnswers();
    this.navigateToResult(this.examForm.examName);
  }

  navigateToResult(exam: any) {
    this._Router.navigate(['result', exam]);
  }

  navigateToExams() {
    this._Router.navigate(['exams']);
  }

  removeAnswers() {
    localStorage.removeItem('studentAnswers');
  }

  // Completed Date
  formatDate() {
    const date = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    return `${formattedDate} at ${formattedTime}`;
  }

  // Calculate Grade
  grade(score: string) {
    let determineScore = +score.slice(0, score.indexOf('/'));
    let scorePercent = (determineScore * 100) / this.examForm.questions.length;
    if (scorePercent >= 90 && scorePercent <= 100) {
      return 'Excellent';
    } else if (scorePercent >= 80 && scorePercent <= 89) {
      return 'Very Good';
    } else if (scorePercent >= 70 && scorePercent <= 79) {
      return 'Good';
    } else if (scorePercent >= 60 && scorePercent <= 69) {
      return 'Satisfactory';
    } else if (scorePercent >= 50 && scorePercent <= 59) {
      return 'Pass';
    } else {
      return 'Fail';
    }
  }

  navigateToDiscussion() {
    this._Router.navigate(['discussion']);
  }
}
