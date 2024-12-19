import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
	const router = inject(Router);
	const userService = inject(UserService);
	const expectedRoleArray = route.data['expectedRole'];
	const token = localStorage.getItem('token') ?? '';
	var tokenPayload:any;
	var isAuthenticated = false;
	var checkRole = false;
	if(!token || token ==''){
		isAuthenticated = false;
	} else {
		isAuthenticated = true;
	}
	try {
		tokenPayload = jwtDecode(token);
		userService.userInfo.set(tokenPayload);
		console.log('tokenPayload', tokenPayload);
	} catch (err) {
		localStorage.clear();
		router.navigate(['/login']);
		return false;
	}
  
  	for (let role of expectedRoleArray) {
  		if(role == tokenPayload.role) {
  			checkRole = true;
  		}
  	}

  	if(isAuthenticated == true && checkRole == true) {
  		return true;
  	} else {
  		router.navigate(['/login']);
  		return false;
  	}
};
