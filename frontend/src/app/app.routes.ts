import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { LayoutComponent } from './layout/layout.component';
import { BillCounterComponent } from './bill-counter/bill-counter.component';
import { authGuard } from './auth.guard';
import { GenerateBillComponent } from './generate-bill/generate-bill.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '',
		component: LayoutComponent,
		children: [
			{
				path: 'billCounter',
				component: BillCounterComponent,
				canActivate: [authGuard],
				data: {
					expectedRole: ['admin', 'user']
				}
			},
			{
				path: 'generateBill',
				component: GenerateBillComponent,
				canActivate: [authGuard],
				data: {
					expectedRole: ['admin', 'user']
				}
			}
		]
	}
];
