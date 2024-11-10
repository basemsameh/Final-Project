
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  contactForm = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(7)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    subject: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    id: new FormControl(null, [
      Validators.required,
      Validators.min(10000),
      Validators.max(99999),
    ]),
    message: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  reloadPage() {
    location.reload();
  }

  sendEmail() {
    if (this.contactForm.valid) {
      const serviceID = 'service_v8jb1vb'; // Add your EmailJS service ID here
      const templateID = 'template_mmx30s9'; // Add your EmailJS template ID here

      const formValues = this.contactForm.value;

      const templateParams = {
        from_name: formValues.name,
        from_email: formValues.email,
        id: formValues.id,
        subject: formValues.subject,
        message: formValues.message,
      };

      emailjs
        .send(serviceID, templateID, templateParams, 'y-RZGO3ATKniH9TJ4')
        .then(
          (response: EmailJSResponseStatus) => {
            console.log(
              'Email successfully sent!',
              response.status,
              response.text
            );
          },
          (error) => {
            console.error('Failed to send email. Error:', error);
          }
        );
    }
  }
}
