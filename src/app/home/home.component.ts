import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  courses!: any[];
  constructor(private service: DataService, private router: Router) {}
  ngOnInit(): void {
    this.courses = this.service.courses.slice(0, 3);
  }

  navigateToCourse(id: number): void {
    this.router.navigate(['courses', id]);
  }

  getFullStart(course: any): any[] {
    return Array(Math.floor(course.rate)).fill(1);
  }

  getEmptyStars(course: any): any[] {
    return Array(5 - Math.ceil(course.rate)).fill(1);
  }

  topCategories = [
    {
      imgNum: 1,
      categoryName: 'Development',
      explain: '102 Courses',
    },
    {
      imgNum: 2,
      categoryName: 'Data Science',
      explain: '8 Courses',
    },
    {
      imgNum: 3,
      categoryName: 'Business',
      explain: '25 Courses',
    },
    {
      imgNum: 4,
      categoryName: 'Marketing',
      explain: '50 Courses',
    },
    {
      imgNum: 5,
      categoryName: 'Technology',
      explain: '20 Courses',
    },
    {
      imgNum: 6,
      categoryName: 'Communation',
      explain: '15 Courses',
    },
    {
      imgNum: 1,
      categoryName: 'Programming',
      explain: '5 Courses',
    },
    {
      imgNum: 7,
      categoryName: 'Content Writing',
      explain: '5 Courses',
    },
  ];

  articles = [
    {
      imgNum: 1,
      title: 'But I must explain to you how all this mistaken',
      description: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium dicta facere, recusandae similique id eligendi vitae ipsum. Illum qui, soluta sequi incidunt distinctio velit repellat non cupiditate quo eveniet earum quisquam repellendus cum inventore culpa odit.`,
      updated: new Date(),
    },
    {
      imgNum: 2,
      title: 'This mistaken idea of printer took a galley',
      description:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur eveniet ratione omnis distinctio asperiores maxime. Soluta corporis earum voluptatem, est praesentium vitae sint quasi veniam sapiente exercitationem, sequi corrupti tenetur optio voluptas quidem!',
      updated: new Date(),
    },
    {
      imgNum: 3,
      title: 'Many desktop publishing packages',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Error vel doloremque earum optio assumenda, tempore quam qui natus animi, commodi aliquam id obcaecati illum accusantium ea ad aliquid accusamus quisquam. Quisquam vel quo hic dicta in perspiciatis? Ipsa, aliquid nisi?',
      updated: new Date(),
    },
  ];
}
