import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const authToken = localStorage.getItem('token');
	if(authToken){
		req = req.clone({
			setHeaders: {
				'authorization': `Bearer ${authToken}`,
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		})
	}

  return next(req);
};
