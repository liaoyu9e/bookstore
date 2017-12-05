import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConst } from '../../constants/app-const';
import { User } from '../../models/user';
import { UserPayment } from '../../models/user-payment';
import { UserBilling } from '../../models/user-billing';
import { UserShipping } from '../../models/user-shipping';
import { Order } from '../../models/order';
import { UserService } from '../../services/user.service';
import { LoginService } from '../../services/login.service';
import { PaymentService } from '../../services/payment.service';
import { ShippingService } from '../../services/shipping.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  private yearList = AppConst.yearList;
  private serverPath = AppConst.serverPath;
  private dataFetched = false;
  private loginError: boolean;
  private loggedIn: boolean;
  private credential = {'username':'', 'password':''};
  
  private user: User = new User();
  private updateSuccess: boolean;
  private newPassword: string;
  private incorrectPassword: boolean;
  
  private passwordMatched: boolean = true;
  
  private selectedProfileTab: number = 0;
  private selectedBillingTab: number = 0;
  private selectedShippingTab: number = 0;
  private userPayment: UserPayment = new UserPayment();
  private userBilling: UserBilling = new UserBilling();
  private userShipping: UserShipping = new UserShipping();
  private order: Order = new Order();
  private userPaymentList: UserPayment[] = [];
  private userShippingList: UserShipping[] = [];
  private orderList: Order[] = [];
  private displayOrderDetail: boolean;
  private defaultPaymentSet: boolean;
  private defaultShippingSet: boolean;
  private defaultUserPaymentId: number;
  private defaultUserShippingId: number;
  
  private stateList: string[] = Object.keys(AppConst.usStates);
  
  constructor(private loginService: LoginService, private userService: UserService, private paymentService: PaymentService, private shippingService: ShippingService, private orderService: OrderService, private router: Router) { }
  
  selectedShippingChange(value: number){
	  this.selectedShippingTab = value;
  }
  
  selectedBillingChange(value: number){
	  this.selectedBillingTab = value;
  }
  
  getCurrentUser(){
	  this.userService.getCurrentUser().subscribe(
		res => {
			this.user = res.json();
			this.user.password = "";
			this.userPaymentList = this.user.userPaymentList;
			this.userShippingList = this.user.userShippingList;
			for(let index in this.userPaymentList){
				if(this.userPaymentList[index].defaultPayment){
					this.defaultUserPaymentId = this.userPaymentList[index].id;
					break;
				}
			}
			for(let index in this.userShippingList){
				if(this.userShippingList[index].defaultShipping){
					this.defaultUserShippingId = this.userShippingList[index].id;
					break;
				}
			}
			this.dataFetched = true;
		},
		error => {
			console.log(error);			
		}
	  );
  }
  
  onPasswordMatch(newPass: string, conPass: string){
	  if(newPass != conPass){
		  this.passwordMatched = false;
	  }else{
		  this.passwordMatched = true;
	  }
	  // console.log({
		  // 'newPassword':newPass,
		  // 'confirmPassword':conPass,
		  // 'passwordMatched':this.passwordMatched
	  // });
  }
  
  onUpdateUserInfo(){
	  this.userService.updateUserInfo(this.user, this.newPassword).subscribe(
		res => {
			console.log(res.text());
			this.updateSuccess = true;
		},
		error => {
			console.log(error.text());
			let errorMessage = error.text();
			if(errorMessage.includes("Incorrect password")) this.incorrectPassword = true;
			
		}
	  );
  }
  
  onNewPayment(){
	  this.paymentService.newPayment(this.userPayment).subscribe(
		res => {
			this.getCurrentUser();
			this.selectedBillingTab = 0;
			this.userPayment = new UserPayment();
		},
		error => {
			console.log(error.text());
		}
	  );
  }
  
  onNewShipping(){
	  this.shippingService.newShipping(this.userShipping).subscribe(
		res => {
			this.getCurrentUser();
			this.selectedShippingTab = 0;
			this.userShipping = new UserShipping();
		},
		error => {
			console.log(error.text());
		}
	  );
  }
  
  onUpdatePayment(payment: UserPayment){
	  this.userPayment = payment;
	  this.userBilling = payment.userBilling;
	  this.selectedBillingTab = 1;
  }
  
  onUpdateShipping(shipping: UserShipping){
	  this.userShipping = shipping;
	  this.selectedBillingTab = 1;
  }
  
  onRemovePayment(id: number){
	  this.paymentService.removePayment(id).subscribe(
		res => {
			this.getCurrentUser();
		},
		error => {
			console.log(error.text());
		}
	  );
  }
  
  onRemoveShipping(id: number){
	  this.shippingService.removeShipping(id).subscribe(
		res => {
			this.getCurrentUser();
		},
		error => {
			console.log(error.text());
		}
	  );
  }
  
  setDefaultPayment(){
	  this.defaultPaymentSet = false;
	  this.paymentService.setDefaultPayment(this.defaultUserPaymentId).subscribe(
		res => {
			this.getCurrentUser();
			this.defaultPaymentSet = true;
		},
		error => {
			console.log(error.text());
		}
	  );
  }
  
  setDefaultShipping(){
	  this.defaultShippingSet = false;
	  this.shippingService.setDefaultShipping(this.defaultUserShippingId).subscribe(
		res => {
			this.getCurrentUser();
			this.defaultShippingSet = true;
		},
		error => {
			console.log(error.text());
		}
	  );
  }
  
  onDisplayOrder(order: Order){
	  console.log(order);
	  this.order = order;
	  this.displayOrderDetail = true;
  }
  
  ngOnInit() {
	  this.loginService.checkSession().subscribe(
		res => {
			this.loggedIn = true;
		},
		error => {
			this.loggedIn = false;
			console.log("Inactive session");
			this.router.navigate(['/myAccount']);
		}
	  );
	  
	  this.orderService.getOrderList().subscribe(
		res => {
			this.orderList = res.json();
		},
		error => {
			console.log(error.text());
		}
	  );
	  
	  this.getCurrentUser();

	  this.userBilling.userBillingState = "";
	  this.userShipping.userShippingState = "";
	  this.userPayment.type = "";
	  this.userPayment.expiryMonth = "";
	  this.userPayment.expiryYear = "";
	  this.userPayment.userBilling = this.userBilling;
	  this.defaultPaymentSet = false;
	  this.defaultShippingSet = false;
  }

}
