import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JsonPipe, CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { tap } from 'rxjs/operators';


interface CategoryList {
	id: number,
	name: string
}

interface productDetails {
	'name': string,
	'price': number,
	'quantity': number,
	'amount': number
}

interface counterInfo {
	'name'?: string,
	'products'?: productDetails[]
	'isActive'?: number,
	'sitting_category'?: string,
	'sid'?: number

}

interface ProductList {
	id?: number,
	name?: string,
	price?: number,
	status?: string,
	catId?: number,
	catName?: string
}
interface ExistingKot {
	kid?: number,
	product?: ProductList
}

@Component({
  selector: 'app-product-selection',
  standalone: true,
  imports: [JsonPipe, CommonModule],
  templateUrl: './product-selection.component.html',
  styleUrl: './product-selection.component.scss'
})
export class ProductSelectionComponent {
	selectedItem: any = null;
	selectedItemName: string = '';
	countertblname = '';
	categoryList:Array<CategoryList> = [];
	productList:Array<ProductList> = [];
	existingKot:Array<ExistingKot> = [];
	selectedKot:any = 'all';

	@Input({ required: true }) counterName:string = '';
	@Input({required: true }) selectedCounterinfo:counterInfo = {};
	@Output() exitButtonClick = new EventEmitter<MouseEvent>();
	isdisplaycat = true;
	bill:any = {};
	billItems:any = [];
	itemsByKot:any = [];
	totalAmount = 0;
	userInfo: any;
	sortColumn = 'kid'; // Default sort column
	reverseSort = false; // Default sort order
	

	constructor(private userService: UserService){
		this.userInfo = this.userService.userInfo();

	}
	
	ngOnChanges(){
		
		this.bill = {tid:this.selectedCounterinfo.sid ,table_name: this.counterName, product: [], updated_by: this.userInfo.uid, status: 'active'};
		this.countertblname = this.counterName + '';
		
		this.userService.getCategoryList().subscribe((results:any)=>{
			this.categoryList = results;
		}, (error)=>{
			console.log('error while getting categoryList', error);
		});
		
	}


	ngOnInit(){
		
		this.userService.getAllKotForTable(this.bill.tid).pipe(
		  	tap((results: any) => {
			    this.existingKot = results;
			    this.setAllKotdataOnWindow(this.existingKot);
			}),
		  	tap(() => {
			  	if(this.billItems && this.billItems.length > 0){
			  		for (const item of this.billItems) {
				    	const costForItem = item.quantity * item.price;
				    	this.totalAmount = this.totalAmount + costForItem;
			    	}

			  	} 
		  	})
		).subscribe();

	}

	sortItems(column: string) {
		if (this.sortColumn === column) {
		  this.reverseSort = !this.reverseSort;
		} else {
		  this.sortColumn = column;
		  this.reverseSort = false;
		}

		let billItems = 0 < this.billItems.length ? this.billItems : this.bill['product'];
		
		billItems.sort((a: any, b: any) => {
		let  valA = a[column];
		let  valB = b[column];
		
		if (column === 'amount') {
			valA = a.price * a.quantity;
			valB = b.price * b.quantity;
		}

		if('number' == typeof valA && 'number' == typeof valB ) {
			return this.reverseSort ? valB - valA :  valA - valB;
		}
		
		if('string' == typeof valA && 'string' == typeof valB ) {
			if (valA < valB) return this.reverseSort ? 1 : -1;
			if (valA > valB) return this.reverseSort ? -1 : 1;
		}

		return 0;
		});
	  }

	setAllKotdataOnWindow(KotData:any){ /* Can call when user select All from DropDown */
		for (const result of KotData) {
		    	let prod = JSON.parse(result.product).map((p:any)=>{
		    		return {...p, kid: result.kid}
		    	});
		    	
		      this.billItems = [...this.billItems, ...prod];
		}
	}

	onSelectKot(kotId:any){
		this.totalAmount = 0;
		this.billItems = [];
		this.bill['product'] = [];
		const selectedKot = kotId.target.value;

		if(selectedKot === 'all'){
			this.selectedKot = 'all';
			this.setAllKotdataOnWindow(this.existingKot);
			if(this.billItems && this.billItems.length > 0){
			  		for (const item of this.billItems) {
				    	const costForItem = item.quantity * item.price;
				    	this.totalAmount = this.totalAmount + costForItem;
			    	}
			  	} 

		}else {
			
			let products:{kid?: number | undefined, product?: any} = this.existingKot[selectedKot];
	  		this.selectedKot = products.kid;
	  		for(let item of JSON.parse(products.product)){
	  			item.kid = products.kid;
	  			this.bill['product'].push(item);
	  			this.totalAmount = this.totalAmount + (item.price * item.quantity);
	  		}
		}
		
	}

	selectCategory(cid:number){
		this.isdisplaycat = false;
		this.getProductListof(cid);
	}

	backtoCategoryView(){
		this.isdisplaycat = true;
	}

	getProductListof(cid:number){
		this.userService.getProductListByCategoryid(cid).subscribe((products:any)=>{
			this.productList = products;
		})
	}

	deleteItemFromKot() {

		if (this.selectedItem >= 0 && this.selectedItem < this.bill['product'].length) {
			const currentQuantity = this.bill['product'][this.selectedItem].quantity;
			const itemPrice = this.bill['product'][this.selectedItem].price;
			this.totalAmount = this.totalAmount - (itemPrice * currentQuantity);
    		this.bill['product'].splice(this.selectedItem, 1);
  		}
	}

	increaseQuantityBy(newQuantity:number){
		const currentQuantity = this.bill['product'][this.selectedItem].quantity;
		const quantityIncreasedBy = newQuantity - currentQuantity;
		const itemPrice = this.bill['product'][this.selectedItem].price;
		let tempTotal = itemPrice * (quantityIncreasedBy);
		

		this.bill['product'][this.selectedItem].quantity = newQuantity;
		this.totalAmount = this.totalAmount + tempTotal;
	
	}

	selectProduct(product:any){
		
		if(this.bill.product.length == 0){
			product.quantity = 1;
			this.bill['product'].push(product);
			this.totalAmount = this.totalAmount + product.price;
		} else {
			const temp = this.bill['product'];
			const index = temp.findIndex((item:any) => item.id === product.id);
			if(index != -1){
				this.bill.product[index].quantity = this.bill.product[index].quantity + 1;
				this.totalAmount = this.totalAmount + this.bill.product[index].price;
			} else {
				product.quantity = 1;
				this.bill['product'].push(product);
				this.totalAmount = this.totalAmount + product.price;
			}

			
		}

	}


	saveKOT(){
		
		if(this.selectedKot === 'all' && this.bill.product.length > 0){
			this.userService.addTableKOT(this.bill).subscribe((response:any)=>{
				this.backToBillCounterPage();
			});
		} else {
			this.userService.updateToableKot(this.bill, this.selectedKot).subscribe((response: any)=>{
			})
		}
		
	}

	backToBillCounterPage(event?: MouseEvent){
		this.exitButtonClick.emit(event);
		
	}
}
