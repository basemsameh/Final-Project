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

  constructor(private http: HttpClient) {
    afterNextRender(() => {
      const storeLogin = localStorage.getItem('isLoginedBefore');
      if (storeLogin) {
        try {
          // Instead of overwriting the BehaviorSubject, use .next() to update its value
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

  getCourses(): Observable<any> {
    return this.http.get('https://fakestoreapi.com/products');
  }

  courses: any[] = [
    {
      id: 1,
      courseName: 'Frontend With Angular v18',
      description:
        'Master Angular for building scalable web applications. This course covers the latest features in Angular 18, including advanced component design and performance optimization.',
      price: 120,
      rate: 4.8,
      favourite: false,
      category: 'Development',
      level: 'Intermediate',
      duration: '40 hours',
      instructor: 'Basem Sameh',
      prerequisites: ['HTML', 'CSS', 'JavaScript basics'],
      enrollmentCount: 3000,
      ratingCount: 520, // number of people who rated
      releaseDate: '2023-01-15', // release date of the course
      language: 'English', // language of the course
    },
    {
      id: 2,
      courseName: 'Frontend With ReactJS v18',
      description:
        'Learn React from the basics to advanced concepts. Build interactive UIs and dynamic web applications using the latest React v18 features.',
      price: 110,
      rate: 4.7,
      favourite: false,
      category: 'Development',
      level: 'Intermediate',
      duration: '35 hours',
      instructor: 'Mohamed Mojib',
      prerequisites: ['HTML', 'CSS', 'JavaScript basics'],
      enrollmentCount: 2700,
      ratingCount: 480,
      releaseDate: '2023-03-20',
      language: 'English',
    },
    {
      id: 3,
      courseName: 'Digital Marketing',
      description:
        'Gain expertise in digital marketing strategies, SEO, social media marketing, and email marketing to boost online presence and engagement.',
      price: 90,
      rate: 4.6,
      favourite: false,
      category: 'Business',
      level: 'Beginner',
      duration: '25 hours',
      instructor: 'Qassam Atef',
      prerequisites: ['None'],
      enrollmentCount: 2000,
      ratingCount: 330,
      releaseDate: '2022-10-05',
      language: 'English',
    },
    {
      id: 4,
      courseName: 'Bootstrap v5',
      description:
        'An introduction to Bootstrap, the popular CSS framework, for creating responsive and mobile-first web applications quickly.',
      price: 40,
      rate: 4.5,
      favourite: false,
      category: 'Technology',
      level: 'Beginner',
      duration: '10 hours',
      instructor: 'Karim Ayman',
      prerequisites: ['HTML', 'CSS'],
      enrollmentCount: 1500,
      ratingCount: 210,
      releaseDate: '2022-08-18',
      language: 'English',
    },
    {
      id: 5,
      courseName: 'Python for Beginners',
      description:
        'Learn Python programming from scratch. This beginner-friendly course covers basic syntax, data structures, and programming fundamentals.',
      price: 75,
      rate: 4.9,
      favourite: false,
      category: 'Programming',
      level: 'Beginner',
      duration: '20 hours',
      instructor: 'Megan Taylor',
      prerequisites: ['None'],
      enrollmentCount: 4500,
      ratingCount: 610,
      releaseDate: '2022-12-10',
      language: 'English',
    },
    {
      id: 6,
      courseName: 'Intro To Data Science',
      description:
        'Explore the basics of data science, including data analysis, statistics, and machine learning techniques.',
      price: 130,
      rate: 4.8,
      favourite: false,
      category: 'Data Science',
      level: 'Intermediate',
      duration: '45 hours',
      instructor: 'Michael Brown',
      prerequisites: ['Python basics', 'Statistics basics'],
      enrollmentCount: 3200,
      ratingCount: 580,
      releaseDate: '2023-02-01',
      language: 'English',
    },
  ];
}
