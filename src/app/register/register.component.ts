import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import { SharedService } from '../service/shared-service.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showPassword: boolean;
  showPasswordConfirm: boolean;
  showPasswordIcon = 'pi pi-eye-slash';
  showPasswordConfirmIcon = 'pi pi-eye-slash';

  registerForm: FormGroup;

  emailCheckValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const email = group.get('email');
    const confirmEmail = group.get('confirmEmail');

    return email && confirmEmail && email.value === confirmEmail.value ? null : {'emailCheck': true};
  }

  passwordCheckValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value ? null : {'passwordCheck': true};
  }

  constructor(public router: Router, public authInstance: AngularFireAuth, private messageService: MessageService,
              private db: AngularFirestore, private sharedService: SharedService, private fb: FormBuilder) {
    this.sharedService.scrollPanelHeightToSubtract.emit(0);

    this.registerForm = this.fb.group({
      firstName: this.fb.control('', Validators.required),
      lastName: this.fb.control('', Validators.required),
      organization: this.fb.control('', Validators.required),
      email: this.fb.control('', [Validators.required, Validators.email]),
      confirmEmail: this.fb.control('', Validators.required),
      password: this.fb.control('', [Validators.required,
        Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{7,}$/)]),
      confirmPassword: this.fb.control('', Validators.required)
    }, {validator: [this.emailCheckValidator, this.passwordCheckValidator]});
  }

  ngOnInit() {
  }

  togglePasswordCheck() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.showPasswordIcon = 'pi pi-eye';
    } else {
      this.showPasswordIcon = 'pi pi-eye-slash';
    }
  }

  toggleConfirmPasswordCheck() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
    if (this.showPasswordConfirm) {
      this.showPasswordConfirmIcon = 'pi pi-eye';
    } else {
      this.showPasswordConfirmIcon = 'pi pi-eye-slash';
    }
  }

  isControlValid(controlName: string, errorName: string) {
    const control = this.registerForm.get(controlName);
    return control.hasError(errorName) && (control.dirty || control.touched);
  }

  async registerClick() {
    if (!this.registerForm.valid) {
      Object.keys(this.registerForm.controls).forEach(field => {
        this.registerForm.controls[field].markAsTouched({onlySelf: true});
      });
    } else {
      try {
        await this.authInstance.auth.createUserWithEmailAndPassword(this.registerForm.get('email').value,
          this.registerForm.get('password').value);
        this.authInstance.auth.currentUser.sendEmailVerification();

        try {
          // Now let's save personal information.
          const userId: string = this.authInstance.auth.currentUser.uid;
          await this.db.collection('users').doc(userId).set({
            firstName: this.registerForm.get('firstName').value,
            lastName: this.registerForm.get('lastName').value,
            organization: this.registerForm.get('organization').value,
            userId: userId
          });
        } catch (errorSU) {
          console.log('Document failed with ID: ', errorSU);
        } finally {
          this.router.navigate(['']);
        }
      } catch (errorCU) {
        this.messageService.add({severity: 'error', summary: 'Login Error', detail: errorCU});
      }
    }
  }
}
