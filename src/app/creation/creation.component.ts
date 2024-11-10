import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './creation.component.html',
  styleUrl: './creation.component.css',
})
export class CreationComponent implements OnDestroy {
  activeToolsBtns(collapseIndex: number, btnIndex: number) {
    let collapse = document.querySelectorAll('.collapse');
    collapse[collapseIndex].children[btnIndex].classList.toggle('active');
  }

  makeTextBold(index: number) {
    let inpts = document.querySelectorAll('.editTextInpt');
    inpts[index].classList.toggle('fw-bold');
  }

  makeTextItalic(index: number) {
    let inpts = document.querySelectorAll('.editTextInpt');
    inpts[index].classList.toggle('fst-italic');
  }

  makeTextUnderline(index: number) {
    let inpts = document.querySelectorAll('.editTextInpt');
    inpts[index].classList.toggle('text-decoration-underline');
  }

  saveQuestionsData() {
    localStorage.setItem('examForm', JSON.stringify(this.examForm));
  }

  examForm: any = this.getDataToExamForm();
  getDataToExamForm() {
    let storedData = localStorage.getItem('examForm');
    if (storedData) {
      this.examForm = JSON.parse(storedData);
    } else {
      this.examForm = {
        examName: '',
        description: '',
        headTools: {
          isBold: false,
          isItalic: false,
          isUnderline: false,
        },
        timeLimit: 0,
        questions: [
          {
            qName: '',
            inputType: 'radio',
            answers: [''],
            properties: {
              isBold: false,
              isItalic: false,
              isUnderline: false,
              isRequired: false,
            },
          },
        ],
        modelAnswer: [{ answers: [] }],
      };
      this.saveQuestionsData();
    }
    return this.examForm;
  }

  // Add new question
  addQuestions() {
    this.examForm.questions.push({
      qName: '',
      inputType: 'radio',
      answers: [''],
      properties: {
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isRequired: false,
      },
    });
    this.examForm.modelAnswer.push({ answers: [] });
    this.saveQuestionsData();
  }

  // Remove question
  removeQuestions(index: number) {
    this.examForm.questions.splice(index, 1);
    this.examForm.modelAnswer.splice(index, 1);
  }

  // Add new answer
  addAnswers(selectIndex: number) {
    this.examForm.questions[selectIndex].answers.push('');
    this.saveQuestionsData();
  }

  // remove answer
  removeAnswers(questionIndex: number, eleIndex: number) {
    this.examForm.questions[questionIndex].answers.splice(eleIndex, 1);
    this.saveQuestionsData();
  }

  // Send Exam methods
  examsSended: any[] = this.getDataToExamSended();
  getDataToExamSended() {
    let storedData = localStorage.getItem('examsSended');
    if (storedData && JSON.parse(storedData).length > 0) {
      this.examsSended = JSON.parse(storedData);
    } else {
      this.examsSended = [];
    }
    return this.examsSended;
  }

  // Send exam to exams page and push it to "examsSended"
  sendExam(): void {
    this.examsSended.push(this.examForm);
    localStorage.setItem('examsSended', JSON.stringify(this.examsSended));
    // Part of Notifications
    let users = JSON.parse(localStorage.getItem('users')!);
    let loginedUser = JSON.parse(localStorage.getItem('loginedUser')!);
    let currentName = `${loginedUser.fname} ${loginedUser.lname}`;
    // [1] Students
    let students = users[0].students;
    this.examSendedNotific(`${currentName}`, students);
    // [2] Instructors
    let instructors = users[0].instructors;
    this.examSendedNotific(`${currentName}`, instructors);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('examForm');
    this.examForm = this.getDataToExamForm();
  }

  // Send notification of exam that sended currently
  examSendedNotific(name: string, array: any[]): void {
    for (let i = 0; i < array.length; i++) {
      array[i].notifications.unshift({
        message: `Instructor <strong>${name}</strong> has added a new exam to the list of exams titled: <strong>${this.examForm.examName}</strong>`,
        readed: false,
      });
    }
  }

  checkInputType(type: string, index: number, answerIndex: number): void {
    let answer = this.examForm.questions[index].answers[answerIndex];
    let modelAnswers = this.examForm.modelAnswer[index].answers;
    if (type === 'radio') {
      modelAnswers[0] = answer;
    } else {
      modelAnswers.includes(answer)
        ? modelAnswers.splice(modelAnswers.indexOf(answer), 1)
        : modelAnswers.push(answer);
    }
    this.saveQuestionsData();
  }

  // Reload Page
  reloadPage(): void {
    location.reload();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('examForm');
  }
}
