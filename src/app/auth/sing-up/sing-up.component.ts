import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit, OnDestroy {

  userUnsub: Subscription;
  hideP = true; // used to show or hide the password 
  isLoading=false ; //when the request was send 
  errorMsg = null ;

  signUpForm: FormGroup = new FormGroup({
    'email':new FormControl('',[Validators.required, Validators.email]),
    'password': new FormControl('',[Validators.required, Validators.minLength(6)])
  });
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userUnsub =  this.authService.userSub.subscribe(user => {
      if(!!user){
        this.router.navigate(['/']);
      }
    })
  }

  signUp() {
    this.isLoading=true ;
    if (this.signUpForm.invalid){
      return ;
    }
    console.log(this.signUpForm.value);
    const email=this.signUpForm.value.email;
    const pswd= this.signUpForm.value.password;
    console.log(email);
    console.log(pswd);
    this.authService.signup(email,pswd).subscribe( res =>{
      console.log(res);
      this.isLoading=false;
      this.router.navigate(['/']);
    },
    error => {
      this.isLoading=false;
      console.log(error);
      this.errorMsg = error ;
    });

  }
  ngOnDestroy() {
    if(this.userUnsub) this.userUnsub.unsubscribe();
  }

}
