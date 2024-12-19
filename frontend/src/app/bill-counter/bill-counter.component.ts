import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ProductSelectionComponent } from '../product-selection/product-selection.component';
import { GenerateBillComponent } from '../generate-bill/generate-bill.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

interface sittingCats {
  sitting_id?: number;
  sitting_name?: string;
}

interface counterInfo {
  name?: string;
  products?: productDetails[];
  isActive?: number;
  sitting_category?: string;
  sid?: number;
}

interface productDetails {
  name: string;
  price: number;
  quantity: number;
  amount: number;
}

@Component({
  selector: 'app-bill-counter',
  standalone: true,
  imports: [NgClass, ProductSelectionComponent, GenerateBillComponent, CommonModule],
  templateUrl: './bill-counter.component.html',
  styleUrl: './bill-counter.component.scss',
})
export class BillCounterComponent {

  constructor(
      private router: Router,
      private userService: UserService,
    ) {}

  isStartAddingProduct = false;
  isStartGenerateBills = false;
  totalBillAmount: number = 0;
  availablesittingCats: sittingCats[] = [];
  selectedSittingCat = 0;
  selectedCounterinfo: counterInfo = {};
  availableCounters: counterInfo[] = [
    { name: 'c1', products: [] },
    { name: 'c2', products: [] },
    { name: 'c3', products: [] },
    { name: 'c4', products: [] },
    { name: 'c5', products: [] },
    { name: 'c6', products: [] },
  ];

  selectedCounter: any;
  selectedCounterID: number | undefined = undefined;
  generateBill: any = { product: [] };

  ngOnInit() {
    // Fetch table sitting info
    this.userService.getAllTableSittingInfo(this.selectedSittingCat).subscribe(
      (results: any) => {
        this.availableCounters = results;
      },
      (error: any) => {
        console.error('Error fetching table sitting info:', error);
      }
    );

    // Fetch sitting categories
    this.userService.getSittingCats().subscribe((sr_results: any) => {
      this.availablesittingCats = sr_results;
    });
  }

  // Handle sitting category change
  onSittingCatChange(event: Event, selectedSittingID:any ): void {
    if (!isNaN(selectedSittingID)) {
      this.selectedSittingCat = selectedSittingID;
      this.userService.getAllTableSittingInfo(this.selectedSittingCat).subscribe(
        (results: any) => {
          this.availableCounters = results;
        },
        (error: any) => {
          console.error('Error fetching table sitting info:', error);
        }
      );
    } else {
      console.warn('Invalid selection.');
    }
  }

  // Add products to selected counter info
  addProducts(counterinfo: counterInfo) {
    this.selectedCounterinfo = counterinfo;
    this.isStartAddingProduct = true;
    this.calculateTotalAmount();
  }

  // Navigate back to select counter page
  backToSelectCounterPage(event: any) {
    this.isStartAddingProduct = false;
    this.isStartGenerateBills = false;
  }

  // Handle bill generation event
  onBillGenerated() {
    this.router.navigate(['/generateBill', { id: this.selectedCounterID }])
  }

  // Calculate total bill amount from products
  calculateTotalAmount() {
    if (this.selectedCounterinfo && this.selectedCounterinfo.products) {
      this.totalBillAmount = this.selectedCounterinfo.products.reduce(
        (sum, product) => sum + (product.amount || 0), 0
      );
    } else {
      this.totalBillAmount = 0;
    }
  }
}
