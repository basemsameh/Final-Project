import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-single-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './single-course.component.html',
  styleUrl: './single-course.component.css',
})
export class SingleCourseComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: DataService,
    private router: Router
  ) {}
  courses!: any[];
  getCourseId!: number;
  currentCourse!: any;

  ngOnInit(): void {
    // Get courses from service
    this.courses = this.service.courses;

    this.activatedRoute.params.subscribe((res: Params) => {
      // Get id of course from url
      this.getCourseId = +res['id'];
      // Get current course
      this.currentCourse = this.courses.find(
        (x: any) => x.id === this.getCourseId
      );
      this.setStars();
    });
  }

  fullStars: any;
  emptyStars: any;
  setStars(): void {
    this.fullStars = Array(Math.floor(this.currentCourse.rate)).fill(1);
    this.emptyStars = Array(5 - Math.ceil(this.currentCourse.rate)).fill(1);
  }

  // Check if the next or previous course is valid or not
  checkValidCourse(courseId: number): boolean {
    const course = this.courses.find((x: any) => x.id === courseId);
    return course ? false : true;
  }

  nextCourse(): void {
    this.router.navigate(['courses', this.getCourseId + 1]);
  }

  previousCourse(): void {
    this.router.navigate(['courses', this.getCourseId - 1]);
  }
}
