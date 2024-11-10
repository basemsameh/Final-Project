
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent implements OnInit {
  isStudentLogin: any;
  ngOnInit(): void {
    let storedData = localStorage.getItem('isStudentLogin');
    storedData ? (this.isStudentLogin = JSON.parse(storedData)) : [];
  }

  rotateIcon(id: string) {
    let btn = document.getElementById(`${id}`) as HTMLButtonElement;
    let arrowIcon = btn.children[0].children[0];
    btn.classList.toggle('activeBtn');
    arrowIcon.classList.toggle('rotateIcon');
  }
}
