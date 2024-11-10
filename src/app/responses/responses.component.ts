
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-responses',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './responses.component.html',
  styleUrl: './responses.component.css',
})
export class ResponsesComponent implements OnInit {
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _DataService: DataService,
    private _Router: Router
  ) {}

  stdAnswersSended: any;
  examName: any;
  responses: any;

  ngOnInit(): void {
    let storedData = localStorage.getItem('stdAnswersSended');
    storedData
      ? (this.stdAnswersSended = JSON.parse(storedData))
      : (this.stdAnswersSended = []);

    // Get exam name from URL
    this.examName = this._ActivatedRoute.snapshot.params['examName'];

    // Get responses of current exam
    this.responses = this.stdAnswersSended[this.examName];
    console.log(this.responses);
  }

  // Check if stdAnswersSended object is empty or not
  testObjEmpty() {
    return Object.values(this.stdAnswersSended).every(
      (value) => value !== null && value !== undefined
    );
  }

  // Change student name in data service when click on answers button
  changeStdIdNumber(index: number, exam: string) {
    this._DataService.stdIdNumber.next(this.responses[index].id);
    this._DataService.instructorShowAns.next(true);
    this._Router.navigate(['exams', exam]);
  }
}
