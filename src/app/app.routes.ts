import { Routes } from '@angular/router';
import { CreationComponent } from './creation/creation.component';
import { ExamsComponent } from './exams/exams.component';
import { SingleExamComponent } from './single-exam/single-exam.component';
import { StudentsComponent } from './students/students.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResultComponent } from './result/result.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './profile/profile.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { dataGuard } from './data.guard';
import { instructorsGuard } from './instructors.guard';
import { ResponsesComponent } from './responses/responses.component';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'discussion', pathMatch: 'full' },
  {
    path: 'discussion',
    component: DiscussionComponent,
    canActivate: [dataGuard],
  },
  {
    path: 'creation',
    component: CreationComponent,
    canActivate: [dataGuard, instructorsGuard],
  },
  { path: 'exams', component: ExamsComponent, canActivate: [dataGuard] },
  {
    path: 'exams/:exam',
    component: SingleExamComponent,
    canActivate: [dataGuard],
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [dataGuard, instructorsGuard],
  },
  {
    path: 'responses/:examName',
    component: ResponsesComponent,
    canActivate: [dataGuard, instructorsGuard],
  },
  { path: 'result/:exam', component: ResultComponent },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [dataGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [dataGuard] },
  { path: 'faq', component: FaqComponent, canActivate: [dataGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [dataGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotfoundComponent },
];
