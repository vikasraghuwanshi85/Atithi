import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	url = environment.apiUrl;

  	constructor(private httpClient: HttpClient) { }

  	userInfo = signal({});

  	signup(data:any){
  		const body = JSON.stringify(data);
  		return this.httpClient.post(this.url+"/user/signup", data);
  	}

    login(data:any){
      const body = JSON.stringify(data);
      return this.httpClient.post(this.url+"/user/login", body, {
        headers: new HttpHeaders({
          'Content-Type':'application/json'
        })
      });
    }

    checkToken() {
      return this.httpClient.get(this.url + '/user/checkToken');
    }

    getUserList(){
      return this.httpClient.get(this.url + '/user/get');
    }
    getSittingCats(){
      return this.httpClient.get(this.url+'/sitting_cats/get');
    }

    getCategoryList(){
      return this.httpClient.get(this.url + '/category/get');
    }

    addCategory(data:any){
      return this.httpClient.post(this.url + '/category/add', data);
    }

    deleteCategory(id:number){
      return this.httpClient.delete(this.url + '/category/delete' + id);
    }

    /* Product related calls */

    getProductListByCategoryid(cid: number){
      return this.httpClient.get(this.url + '/products/getByCategory/' + cid);
    }

    addTableKOT(data: any){
      return this.httpClient.post(this.url + '/kot/add', data);
    }

    getAllTableSittingInfo(id: number){
      return this.httpClient.get(this.url+'/kot/get/' + id );
    }

    getAllKotForTable(id: number){
      return this.httpClient.get(this.url+'/kot/getkots/'+ id );
    }
    updateToableKot(data: any, id:number){
      return this.httpClient.put(this.url + '/kot/update/id', data);
    }

    //Get bill for the table.
    getBillInfoForTable(id: number ){
      return this.httpClient.get(this.url+'/bill/gettablekots/' + id );
    }

    
}
