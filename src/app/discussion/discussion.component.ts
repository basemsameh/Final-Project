import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css',
})
export class DiscussionComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  loginedUser: any;
  currentTime: any;
  scrolled: boolean = true;

  constructor(private _DataService: DataService) {}

  ngOnInit() {
    // Fetch messages from the service
    this._DataService.getMessages().subscribe((msgs) => {
      this.messages = msgs;
    });

    let storedData = localStorage.getItem('loginedUser');
    storedData ? (this.loginedUser = JSON.parse(storedData)) : [];

    window.onscroll = () => {
      this.checkScrolled();
    };
    this.checkScrolled();
  }

  // Get current time
  updateTime() {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // if hour is 0, set to 12
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    this.currentTime = hours + ':' + formattedMinutes + ' ' + ampm;
    return this.currentTime;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      const message = {
        user: `${this.loginedUser.fname} ${this.loginedUser.lname}`,
        text: this.newMessage,
        img: this.loginedUser.profileImageUrl,
        id: this.loginedUser.id,
        status: this.loginedUser.status,
        time: this.updateTime(),
      };
      this._DataService.addMessage(message).then(() => {
        this.messages.push(message); // Add the new message to the list
        this.newMessage = ''; // Clear the input field
      });
    }
  }

  reloadPage() {
    location.reload();
  }

  // ===================
  checkName(index: number): boolean {
    let currentId = this.loginedUser.id;
    if (currentId === this.messages[index].id) {
      return true;
    } else {
      return false;
    }
  }

  scrollBottom() {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }

  checkScrolled() {
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      this.scrolled = false; // Hide button when at the bottom
    } else {
      this.scrolled = true; // Show button when not at the bottom
    }
  }

  getLocalStorageSize(): number {
    let total = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        total += key.length + (value ? value.length : 0);
      }
    }

    // Convert from characters to bytes (since localStorage stores strings in UTF-16)
    console.log((total * 2) / (1024 * 1024));
    return total * 2; // UTF-16 uses 2 bytes per character
  }
}
