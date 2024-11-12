import { afterNextRender, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of, switchMap } from 'rxjs';
import Dexie, { Table } from 'dexie';
import { HttpClient } from '@angular/common/http';

// Define a Message type for better type safety
interface Message {
  index?: number; // Optional, for auto-increment
  user: string;
  text: string;
  time: string;
  img: string;
  id: number;
}

// Extend Dexie with your own database schema
class MyDatabase extends Dexie {
  messages!: Table<Message>; // Define messages as a table of Message

  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      messages: '++index,id , user, text, time', // Define schema for messages
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isStudentLogin: BehaviorSubject<any> = new BehaviorSubject(false);
  isLoginedBefore: BehaviorSubject<any> = new BehaviorSubject(false);
  profileImageUrl: BehaviorSubject<any> = new BehaviorSubject(
    '../../assets/images/account.png'
  );
  notificNumber: BehaviorSubject<any> = new BehaviorSubject(0);
  // Logined User
  loginedUser: BehaviorSubject<any> = new BehaviorSubject([]);
  // Discusition
  private db: MyDatabase;

  constructor() {
    afterNextRender(() => {
      const storeLogin = localStorage.getItem('isLoginedBefore');
      if (storeLogin) {
        try {
          //  use .next() to update its value
          this.isLoginedBefore.next(JSON.parse(storeLogin));
        } catch (err) {
          console.error(err);
        }
      } else {
        this.isLoginedBefore.next(false);
      }

      const storeStudent = localStorage.getItem('isStudentLogin');
      if (storeStudent) {
        try {
          this.isStudentLogin.next(JSON.parse(storeStudent));
        } catch (err) {
          console.error(err);
        }
      } else {
        this.isStudentLogin.next(false);
      }

      const currentUser = localStorage.getItem('loginedUser');
      if (currentUser) {
        try {
          this.loginedUser.next(JSON.parse(currentUser));
        } catch (err) {
          console.error(err);
        }
      } else {
        this.loginedUser.next([]);
      }

      this.loginedUser.subscribe((x) => {
        this.profileImageUrl.next(x.profileImageUrl);
        let notifics = x.notifications;
        let num = 0;
        if (notifics) {
          for (let i = 0; i < notifics.length; i++) {
            if (!notifics[i].readed) {
              num += 1;
            }
          }
          this.notificNumber.next(num);
        }
      });
    });
    // Discustion
    this.db = new MyDatabase(); // Initialize the database
  }

  async addMessage(message: Message): Promise<void> {
    try {
      await this.db.messages.add(message); // Add new message
    } catch (error) {
      console.error('Error adding message:', error);
    }
  }

  // Retrieve all messages from IndexedDB
  getMessages(): Observable<Message[]> {
    return from(this.db.messages.toArray()); // Return messages as an observable
  }

  // Add a new message to IndexedDB
  sendMessage(
    user: string,
    img: string,
    status: string,
    text: string,
    id: number,
    time: string
  ): Observable<any> {
    const newMessage = {
      user,
      img,
      id,
      status,
      time,
      text,
    };
    return from(this.db.messages.add(newMessage)).pipe(
      switchMap(() => of(newMessage))
    );
  }

  // Update message(like image or name) when change image or account information
  updateMessage(
    userId: number,
    newImageUrl: any,
    userName: any
  ): Observable<any> {
    return from(
      this.db.transaction('rw', this.db.messages, async () => {
        const messages = await this.db.messages.toArray();
        const updatedMessages = messages.map((message) => {
          if (message.id === userId) {
            message.img = newImageUrl; // Update the image URL
            message.user = userName; // Update name of user
          }
          return message;
        });

        // Bulk update the messages
        await this.db.messages.bulkPut(updatedMessages);
        return updatedMessages;
      })
    );
  }

  // Student name for get its answers to instructor
  stdIdNumber: BehaviorSubject<any> = new BehaviorSubject(0);
  instructorShowAns: BehaviorSubject<any> = new BehaviorSubject(false);
}
