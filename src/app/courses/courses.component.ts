import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent {
  courses!: any[];
  constructor(private service: DataService, private router: Router) {}
  ngOnInit(): void {
    this.courses = this.service.courses;
  }

  navigateToCourse(id: number): void {
    this.router.navigate(['courses', id]);
  }
}
