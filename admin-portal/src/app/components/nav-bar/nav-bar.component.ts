import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
	
  private loggedIn = false;
  
  toggleDisplay(){
	  this.loggedIn = !this.loggedIn;
  }
  
  constructor(private loginService: LoginService, private router: Router) { }
  
  logout(){
	  this.loginService.logout().subscribe(
		res => {
			location.reload();
		},
		error => {
			console.log(error);
		}
	  );
	  this.router.navigate(['/']);
  }

  ngOnInit() {
	  this.loginService.checkSession().subscribe(
		res => {
			this.loggedIn = true;
		},
		error => {
			this.loggedIn = false;
		}
	  );
  }

}