import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

// import * as moment from 'moment'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  userUnseb: Subscription ;
  hideP = true; // used to show or hide the password 
  isLouding = false //used when login 
  errorMsg: string = null;
  loginForm: FormGroup = new FormGroup({
    'email': new FormControl('',[ Validators.required, Validators.email]),
    'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  constructor(private authService: AuthService,private router: Router) { }

  ngOnInit() {
    this.userUnseb = this.authService.userSub.subscribe(user =>{
      if (!!user) {
        this.router.navigate(['/']);
      }
    });
  }
  onLogin() {
    this.isLouding = true;
    this.errorMsg = null ;
    const email = this.loginForm.value.email ;
    const pswd = this.loginForm.value.password ;
    this.authService.signin(email, pswd).subscribe(res => {
      this.isLouding = false ;
      this.router.navigate(['/']);
      console.log(res);
      // console.log(moment().format())
      // console.log(res.expiresIn);
      // console.log(moment().add(1,'hour').format());
      // console.log(new Date(moment().add(1,'hour').format()));
    },
    error =>{
      this.isLouding = false ;
      this.errorMsg = error ;
      console.log(this.errorMsg);
    });
  }

  onSignUp(){
    this.router.navigate(['/signup']);
  }

  ngOnDestroy() {
    if(this.userUnseb) this.userUnseb.unsubscribe();
  }

}
