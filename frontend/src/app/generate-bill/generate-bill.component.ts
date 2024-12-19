import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

interface kotDetailsForTable {
  name: string;
  product: string;
  status: string;
}

@Component({
  selector: 'app-generate-bill',
  templateUrl: './generate-bill.component.html',
  imports: [CommonModule],
  styleUrls: ['./generate-bill.component.scss'],
  standalone: true,
})
export class GenerateBillComponent {
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const counterID = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getBillInfoForTable(counterID).subscribe((sr_results: any ) => {
      console.log(sr_results);
    });
  }
  
}
