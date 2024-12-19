import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { jwtDecode } from 'jwt-decode';
import { GlobalConstants } from '../shared/globalConstants';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
	formBilder = inject(FormBuilder);
	loginObj:any = { userName: '', password: ''};
	responseMessage: any;
	signUpForm: FormGroup;
	loginfrm: boolean;

	constructor(private router: Router, private userService: UserService){
		this.loginfrm = true;
		this.signUpForm = new FormGroup({
			name: new FormControl("", [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]),
			email: new FormControl("", [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
			contactNumber: new FormControl("", [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]),
			password: new FormControl("", [Validators.required])
		});
	}

	ngOnInit(): void {
		if(localStorage.getItem('token') != null){
			this.userService.checkToken().subscribe((respnse:any)=>{
				// this.router.navigate(['/billCounter']);
				console.log('success', respnse);
			}, (error)=>{
				console.log('error');
			})
		} else {
			console.log('errrrr');
		}
	}

	onLogin(){
		const data = { "email": this.loginObj.userName, "password": this.loginObj.password};
		this.userService.login(data).subscribe((response:any)=>{
			console.log("Successfull", response);
			var tokenPayload: any;
			try {
				localStorage.setItem('token', response.token);
				const token = response.token;
				tokenPayload = jwtDecode(token);
				if(tokenPayload?.role == GlobalConstants.NORMALUSER){
					console.log('normal user');
					//this.router.navigate(['/billCounter']);
					this.router.navigate(['/billCounter']);
				} else {
					
					this.router.navigate(['/billCounter']);
					// this.router.navigate(['/admin/category']);
				}
			} catch(error) {
				console.error('error', error);
			}
		}, error => {
			if(error.error?.message){
				this.responseMessage = error.error?.message;
			} else {
				this.responseMessage = GlobalConstants.genericError;
			}
		})
	}
}
