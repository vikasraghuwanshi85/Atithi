import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
	constructor(private userService: UserService){}

	userInfo: any;

	ngOnInit(){
		console.log(this.userService.userInfo());
		this.userInfo = this.userService.userInfo();
		console.log(this.userInfo);
	}
}
