
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css',
})
export class StudentsComponent  {
  // students: any = [];
  // users: any;
  // ngOnInit(): void {
  //   let storedData = localStorage.getItem('users');
  //   this.users =
  //     storedData !== null ? (this.users = JSON.parse(storedData)) : [];

  //     this.students = this.users[0].students;
  //   this.getExamsName(0);
  // }

  // getExamsName(index: number) {
  //   let names = Object.keys(this.students[0].exams);
  //   console.log(names)
  // }
}